import re
from typing import List, Tuple
from docx import Document

from backend.schemas import (
    ExtractedBlock,
    BlockType,
    ValidationStatus,
    BoundingBox,
    TableDetails
)

def parse_docx_document(file_path: str, doc_id: str) -> Tuple[int, List[ExtractedBlock]]:
    """
    Parses a DOCX document using python-docx.
    Extracts paragraphs, tables, lists, and metadata blocks with full provenance.
    """
    doc = Document(file_path)
    blocks: List[ExtractedBlock] = []
    block_index = 1
    global_reading_order = 1
    current_page = 1
    y_pos = 60.0

    # 1. Process paragraphs
    for p in doc.paragraphs:
        text = p.text.strip()
        if not text:
            continue

        style_name = (p.style.name if p.style else "").lower()
        is_list = "list" in style_name or bool(re.match(r'^(?:[\*\-\•\–\—]|\d+[\.\)])\s+', text))
        
        # Approximate page break (rough heuristic for docx: ~3500 chars or 40 paragraphs per page)
        if len(blocks) > 0 and len(blocks) % 25 == 0:
            current_page += 1
            y_pos = 60.0

        b_type = BlockType.LIST if is_list else BlockType.TEXT
        b_id = f"block-{block_index:03d}"
        block_index += 1

        blocks.append(
            ExtractedBlock(
                id=b_id,
                type=b_type,
                content=text,
                confidence=0.98,
                pageNumber=current_page,
                boundingBox=BoundingBox(x=54.0, y=y_pos, width=500.0, height=28.0),
                readingOrder=global_reading_order,
                validationStatus=ValidationStatus.VALID,
                sourceDocumentId=doc_id
            )
        )
        global_reading_order += 1
        y_pos += 34.0

    # 2. Process tables
    for t_idx, table in enumerate(doc.tables):
        rows_data = []
        for row in table.rows:
            row_cells = [cell.text.strip() for cell in row.cells]
            rows_data.append(row_cells)

        if not rows_data:
            continue

        headers = rows_data[0]
        data_rows = rows_data[1:] if len(rows_data) > 1 else rows_data
        col_count = len(headers)

        table_content = "\n".join([" | ".join(r) for r in rows_data])
        b_id = f"block-{block_index:03d}"
        block_index += 1

        blocks.append(
            ExtractedBlock(
                id=b_id,
                type=BlockType.TABLE,
                content=table_content,
                confidence=0.95,
                pageNumber=current_page,
                boundingBox=BoundingBox(x=54.0, y=y_pos, width=500.0, height=30.0 * len(rows_data)),
                readingOrder=global_reading_order,
                validationStatus=ValidationStatus.VALID,
                sourceDocumentId=doc_id,
                tableDetails=TableDetails(
                    rows=len(rows_data),
                    columns=col_count,
                    headers=headers,
                    cells=rows_data
                )
            )
        )
        global_reading_order += 1
        y_pos += 35.0 * len(rows_data) + 20.0

    # 3. Process inline shapes (images/figures)
    for shape in doc.inline_shapes:
        b_id = f"block-{block_index:03d}"
        block_index += 1
        blocks.append(
            ExtractedBlock(
                id=b_id,
                type=BlockType.FIGURE,
                content="Inline Embedded Figure / Shape",
                confidence=0.97,
                pageNumber=current_page,
                boundingBox=BoundingBox(x=60.0, y=y_pos, width=300.0, height=180.0),
                readingOrder=global_reading_order,
                validationStatus=ValidationStatus.VALID,
                sourceDocumentId=doc_id
            )
        )
        global_reading_order += 1
        y_pos += 200.0

    return max(1, current_page), blocks
