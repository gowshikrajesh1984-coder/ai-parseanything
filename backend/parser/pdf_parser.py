import re
import io
from typing import List, Tuple
from pypdf import PdfReader
from PIL import Image
import pytesseract

from backend.schemas import (
    ExtractedBlock,
    BlockType,
    ValidationStatus,
    BoundingBox,
    TableDetails
)

MATH_SYMBOLS = set("∑∫√±≈≠≤≥∞÷×π∆∇∂ƒλθΩαβγδε")

def is_equation_text(text: str) -> bool:
    cleaned = text.strip()
    if any(char in MATH_SYMBOLS for char in cleaned):
        return True
    if re.search(r'\\(?:frac|sqrt|sum|int|alpha|beta|sigma|mu)', cleaned):
        return True
    if re.search(r'[a-zA-Z]\s*=\s*[0-9a-zA-Z\+\-\*\/\^\(\)]+', cleaned) and any(op in cleaned for op in ['+', '-', '*', '/', '^']):
        return True
    return False

def is_list_item(text: str) -> bool:
    cleaned = text.strip()
    return bool(re.match(r'^(?:[\*\-\•\–\—]|\d+[\.\)])\s+', cleaned))

def parse_table_lines(lines: List[str]) -> Tuple[List[str], List[List[str]]]:
    """Attempts to parse tabular lines into headers and rows."""
    parsed_rows = []
    for line in lines:
        if "|" in line:
            cells = [c.strip() for c in line.split("|") if c.strip()]
        else:
            cells = [c.strip() for c in re.split(r'\s{2,}|\t', line) if c.strip()]
        if len(cells) >= 2:
            parsed_rows.append(cells)
    
    if len(parsed_rows) >= 2:
        headers = parsed_rows[0]
        data_rows = parsed_rows[1:]
        return headers, data_rows
    return [], []

def parse_pdf_document(file_path: str, doc_id: str) -> Tuple[int, List[ExtractedBlock]]:
    """
    Parses PDF document using PyPDF and OCR fallback if pages are scanned.
    Extracts text blocks, tables, figures, equations, lists, and images.
    Returns: (total_pages, blocks)
    """
    reader = PdfReader(file_path)
    total_pages = len(reader.pages)
    blocks: List[ExtractedBlock] = []
    global_reading_order = 1
    block_index = 1

    page_width = 612.0
    page_height = 792.0

    for page_num_0, page in enumerate(reader.pages):
        page_num = page_num_0 + 1
        
        # Check actual page mediabox if available
        try:
            mb = page.mediabox
            page_width = float(mb.width)
            page_height = float(mb.height)
        except Exception:
            pass

        raw_text = ""
        try:
            raw_text = page.extract_text() or ""
        except Exception:
            raw_text = ""

        # Check for embedded images on this page
        embedded_images = []
        try:
            embedded_images = list(page.images)
        except Exception:
            pass

        # If page has almost no text but has images, perform real OCR on images!
        if len(raw_text.strip()) < 15 and embedded_images:
            for img_idx, img_obj in enumerate(embedded_images):
                try:
                    pil_img = Image.open(io.BytesIO(img_obj.data))
                    ocr_data = pytesseract.image_to_data(pil_img, output_type=pytesseract.Output.DICT)
                    
                    ocr_words = []
                    ocr_conf_sum = 0
                    ocr_conf_count = 0
                    for w_idx, word in enumerate(ocr_data.get("text", [])):
                        conf = float(ocr_data["conf"][w_idx])
                        if word.strip() and conf > 0:
                            ocr_words.append(word)
                            ocr_conf_sum += conf
                            ocr_conf_count += 1
                    
                    if ocr_words:
                        ocr_text = " ".join(ocr_words)
                        avg_ocr_conf = (ocr_conf_sum / ocr_conf_count) if ocr_conf_count > 0 else 75.0
                        
                        b_id = f"block-{block_index:03d}"
                        block_index += 1
                        
                        validation_status = ValidationStatus.VALID if avg_ocr_conf >= 70.0 else ValidationStatus.NEEDS_REVIEW
                        issue = None if avg_ocr_conf >= 70.0 else f"Low OCR certainty ({avg_ocr_conf:.1f}%) on scanned image"
                        
                        blocks.append(
                            ExtractedBlock(
                                id=b_id,
                                type=BlockType.TEXT,
                                content=ocr_text,
                                confidence=round(avg_ocr_conf / 100.0, 3),
                                pageNumber=page_num,
                                boundingBox=BoundingBox(x=50.0, y=80.0, width=page_width - 100.0, height=120.0),
                                readingOrder=global_reading_order,
                                validationStatus=validation_status,
                                sourceDocumentId=doc_id,
                                requiresHumanReview=(validation_status == ValidationStatus.NEEDS_REVIEW),
                                issue=issue
                            )
                        )
                        global_reading_order += 1
                except Exception:
                    pass

        # Add image blocks for detected embedded images
        for img_idx, img_obj in enumerate(embedded_images):
            b_id = f"block-{block_index:03d}"
            block_index += 1
            
            blocks.append(
                ExtractedBlock(
                    id=b_id,
                    type=BlockType.IMAGE,
                    content=f"Embedded Image #{img_idx + 1} ({getattr(img_obj, 'name', 'Raster')})",
                    confidence=0.96,
                    pageNumber=page_num,
                    boundingBox=BoundingBox(x=60.0, y=200.0 + (img_idx * 120.0), width=180.0, height=100.0),
                    readingOrder=global_reading_order,
                    validationStatus=ValidationStatus.VALID,
                    sourceDocumentId=doc_id
                )
            )
            global_reading_order += 1

        # Process extracted text lines
        raw_lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        
        # Detect table candidates: clusters of lines with tabular delimiters or spaces
        current_table_lines = []
        regular_lines = []

        for line in raw_lines:
            has_cols = ("|" in line) or (len(re.split(r'\s{2,}|\t', line)) >= 2)
            if has_cols and len(line) > 10:
                current_table_lines.append(line)
            else:
                if len(current_table_lines) >= 2:
                    # Emit table block
                    headers, data_rows = parse_table_lines(current_table_lines)
                    if headers and data_rows:
                        t_id = f"block-{block_index:03d}"
                        block_index += 1
                        
                        col_count = len(headers)
                        # Check column consistency
                        mismatched_rows = [r for r in data_rows if len(r) != col_count]
                        is_unclear = len(mismatched_rows) > 0
                        table_conf = 0.65 if is_unclear else 0.94
                        
                        blocks.append(
                            ExtractedBlock(
                                id=t_id,
                                type=BlockType.TABLE,
                                content="\n".join(current_table_lines),
                                confidence=table_conf,
                                pageNumber=page_num,
                                boundingBox=BoundingBox(x=50.0, y=150.0, width=page_width - 100.0, height=35.0 * (len(data_rows) + 1)),
                                readingOrder=global_reading_order,
                                validationStatus=ValidationStatus.NEEDS_REVIEW if is_unclear else ValidationStatus.VALID,
                                sourceDocumentId=doc_id,
                                requiresHumanReview=is_unclear,
                                issue="Table structure unclear - column width variance" if is_unclear else None,
                                tableDetails=TableDetails(
                                    rows=len(data_rows) + 1,
                                    columns=col_count,
                                    headers=headers,
                                    cells=[headers] + data_rows
                                )
                            )
                        )
                        global_reading_order += 1
                    current_table_lines = []
                elif current_table_lines:
                    regular_lines.extend(current_table_lines)
                    current_table_lines = []
                regular_lines.append(line)

        # Flush any remaining table lines
        if len(current_table_lines) >= 2:
            headers, data_rows = parse_table_lines(current_table_lines)
            if headers and data_rows:
                t_id = f"block-{block_index:03d}"
                block_index += 1
                col_count = len(headers)
                mismatched = [r for r in data_rows if len(r) != col_count]
                table_conf = 0.62 if mismatched else 0.95
                blocks.append(
                    ExtractedBlock(
                        id=t_id,
                        type=BlockType.TABLE,
                        content="\n".join(current_table_lines),
                        confidence=table_conf,
                        pageNumber=page_num,
                        boundingBox=BoundingBox(x=50.0, y=200.0, width=page_width - 100.0, height=30.0 * (len(data_rows) + 1)),
                        readingOrder=global_reading_order,
                        validationStatus=ValidationStatus.NEEDS_REVIEW if mismatched else ValidationStatus.VALID,
                        sourceDocumentId=doc_id,
                        requiresHumanReview=bool(mismatched),
                        issue="Table structure alignment requires review" if mismatched else None,
                        tableDetails=TableDetails(
                            rows=len(data_rows) + 1,
                            columns=col_count,
                            headers=headers,
                            cells=[headers] + data_rows
                        )
                    )
                )
                global_reading_order += 1
        elif current_table_lines:
            regular_lines.extend(current_table_lines)

        # Group regular text lines into paragraphs/blocks
        current_para = []
        y_pos = 70.0
        
        for line in regular_lines:
            # Check equation
            if is_equation_text(line):
                eq_id = f"block-{block_index:03d}"
                block_index += 1
                blocks.append(
                    ExtractedBlock(
                        id=eq_id,
                        type=BlockType.EQUATION,
                        content=line,
                        confidence=0.88,
                        pageNumber=page_num,
                        boundingBox=BoundingBox(x=60.0, y=y_pos, width=page_width - 120.0, height=35.0),
                        readingOrder=global_reading_order,
                        validationStatus=ValidationStatus.VALID,
                        sourceDocumentId=doc_id
                    )
                )
                global_reading_order += 1
                y_pos += 45.0
                continue

            # Check list item
            if is_list_item(line):
                list_id = f"block-{block_index:03d}"
                block_index += 1
                blocks.append(
                    ExtractedBlock(
                        id=list_id,
                        type=BlockType.LIST,
                        content=line,
                        confidence=0.96,
                        pageNumber=page_num,
                        boundingBox=BoundingBox(x=70.0, y=y_pos, width=page_width - 140.0, height=28.0),
                        readingOrder=global_reading_order,
                        validationStatus=ValidationStatus.VALID,
                        sourceDocumentId=doc_id
                    )
                )
                global_reading_order += 1
                y_pos += 35.0
                continue

            current_para.append(line)
            # Emit block when paragraph reaches ~3 lines or header-like line
            if len(current_para) >= 3 or line.isupper() or len(line) < 30:
                para_text = " ".join(current_para)
                b_id = f"block-{block_index:03d}"
                block_index += 1
                
                # Confidence scoring based on text readability
                non_ascii = sum(1 for c in para_text if ord(c) > 127)
                pct_clean = 1.0 - (non_ascii / max(1, len(para_text)))
                score = round(max(0.45, min(0.99, pct_clean * 0.98)), 3)
                is_low = score < 0.70
                
                blocks.append(
                    ExtractedBlock(
                        id=b_id,
                        type=BlockType.TEXT,
                        content=para_text,
                        confidence=score,
                        pageNumber=page_num,
                        boundingBox=BoundingBox(x=50.0, y=y_pos, width=page_width - 100.0, height=20.0 * len(current_para)),
                        readingOrder=global_reading_order,
                        validationStatus=ValidationStatus.NEEDS_REVIEW if is_low else ValidationStatus.VALID,
                        sourceDocumentId=doc_id,
                        requiresHumanReview=is_low,
                        issue="Low confidence text layer" if is_low else None
                    )
                )
                global_reading_order += 1
                y_pos += 25.0 * len(current_para) + 10.0
                current_para = []

        if current_para:
            para_text = " ".join(current_para)
            b_id = f"block-{block_index:03d}"
            block_index += 1
            blocks.append(
                ExtractedBlock(
                    id=b_id,
                    type=BlockType.TEXT,
                    content=para_text,
                    confidence=0.96,
                    pageNumber=page_num,
                    boundingBox=BoundingBox(x=50.0, y=y_pos, width=page_width - 100.0, height=35.0),
                    readingOrder=global_reading_order,
                    validationStatus=ValidationStatus.VALID,
                    sourceDocumentId=doc_id
                )
            )
            global_reading_order += 1

    return max(1, total_pages), blocks
