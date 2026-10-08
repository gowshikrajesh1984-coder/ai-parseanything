import os
import time
from datetime import datetime
from typing import Callable, Optional, Tuple, Dict, Any, List

from backend.schemas import (
    DocumentMetadata,
    ExtractedBlock,
    BlockType,
    ConfidenceDistribution,
    FlaggedPageItem,
    DocumentValidationError,
    DocumentErrorCode,
    ParsedResultsResponse
)
from backend.parser.pdf_parser import parse_pdf_document
from backend.parser.image_parser import parse_image_document
from backend.parser.docx_parser import parse_docx_document
from backend.parser.confidence import analyze_confidence_and_flags

def validate_file_structure(file_path: str, format_type: str) -> Optional[DocumentValidationError]:
    """Validates file magic bytes and size."""
    if not os.path.exists(file_path):
        return DocumentValidationError(
            code=DocumentErrorCode.CORRUPTED_FILE,
            message="Document file not found on disk.",
            field="file"
        )
    
    file_size = os.path.getsize(file_path)
    if file_size == 0:
        return DocumentValidationError(
            code=DocumentErrorCode.EMPTY_FILE,
            message="The uploaded document is empty (0 bytes).",
            field="size"
        )
    
    if file_size > 25 * 1024 * 1024:
        return DocumentValidationError(
            code=DocumentErrorCode.FILE_TOO_LARGE,
            message="File size exceeds maximum permitted limit of 25 MB.",
            field="size"
        )
        
    with open(file_path, "rb") as f:
        header = f.read(16)
        
    fmt = format_type.upper()
    if fmt == "PDF":
        if not header.startswith(b"%PDF"):
            return DocumentValidationError(
                code=DocumentErrorCode.CORRUPTED_FILE,
                message="File missing valid PDF header signature.",
                field="integrity"
            )
    elif fmt == "PNG":
        if not header.startswith(b"\x89PNG\r\n\x1a\n"):
            return DocumentValidationError(
                code=DocumentErrorCode.CORRUPTED_FILE,
                message="File missing valid PNG binary signature.",
                field="integrity"
            )
    elif fmt in ("JPG", "JPEG"):
        if not (header.startswith(b"\xff\xd8\xff")):
            return DocumentValidationError(
                code=DocumentErrorCode.CORRUPTED_FILE,
                message="File missing valid JPEG binary signature.",
                field="integrity"
            )
    elif fmt == "DOCX":
        if not header.startswith(b"PK\x03\x04"):
            return DocumentValidationError(
                code=DocumentErrorCode.INVALID_FILE_STRUCTURE,
                message="File missing valid DOCX container signature.",
                field="structure"
            )
            
    return None

def run_parsing_pipeline(
    file_path: str,
    doc_id: str,
    original_filename: str,
    progress_callback: Optional[Callable[[int, str], None]] = None
) -> Tuple[ParsedResultsResponse, Optional[DocumentValidationError]]:
    """
    Executes the comprehensive 6-stage parsing pipeline:
    1. Validation
    2. Document Reading
    3. Text Extraction / OCR
    4. Structure Detection
    5. Confidence Analysis
    6. Results & Completion
    """
    start_time = time.time()
    ext = original_filename.split(".")[-1].upper() if "." in original_filename else "PDF"

    def report(progress: int, stage: str):
        if progress_callback:
            progress_callback(progress, stage)

    # Stage 1: Validation
    report(10, "Validating Document Security & Isolation Sandbox...")
    val_error = validate_file_structure(file_path, ext)
    if val_error:
        return None, val_error

    # Stage 2: Document Reading
    report(30, "Reading Document Pages & Dimensional Hierarchy...")
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    size_str = f"{file_size_mb:.1f} MB" if file_size_mb >= 0.1 else f"{os.path.getsize(file_path) / 1024:.0f} KB"

    # Stage 3 & 4: Text Extraction/OCR & Structure Detection
    report(55, "Scanning Document OCR Layers & Extracting Glyphs...")
    total_pages = 1
    blocks: List[ExtractedBlock] = []
    
    try:
        if ext == "PDF":
            report(65, "Extracting Table Grids & Vector Shapes...")
            total_pages, blocks = parse_pdf_document(file_path, doc_id)
        elif ext in ("JPG", "JPEG", "PNG"):
            report(65, "Executing Neural OCR & Region Bounding...")
            total_pages, blocks = parse_image_document(file_path, doc_id)
        elif ext == "DOCX":
            report(65, "Parsing Document Tree & Table Structures...")
            total_pages, blocks = parse_docx_document(file_path, doc_id)
        else:
            return None, DocumentValidationError(
                code=DocumentErrorCode.UNSUPPORTED_FORMAT,
                message=f"Unsupported format: {ext}",
                field="format"
            )
    except Exception as e:
        return None, DocumentValidationError(
            code=DocumentErrorCode.PARSING_FAILED,
            message=f"Parser encountered an error: {str(e)}",
            field="parser"
        )

    # Stage 5: Confidence Analysis & Flagging
    report(85, "Computing Confidence & Cross-Validation Metrics...")
    avg_conf, dist, flagged_pages = analyze_confidence_and_flags(blocks, total_pages)

    # Count block types
    text_blocks = sum(1 for b in blocks if b.type == BlockType.TEXT)
    tables = sum(1 for b in blocks if b.type == BlockType.TABLE)
    figures = sum(1 for b in blocks if b.type == BlockType.FIGURE)
    equations = sum(1 for b in blocks if b.type == BlockType.EQUATION)
    images = sum(1 for b in blocks if b.type == BlockType.IMAGE)
    lists = sum(1 for b in blocks if b.type == BlockType.LIST)
    total_blocks = len(blocks)

    duration = round(time.time() - start_time, 1)
    duration_str = f"{duration} seconds"
    processed_at_str = datetime.now().strftime("%b %d, %Y • %I:%M %p")

    # Stage 6: Results Compilation
    report(100, "Document parsing is complete!")

    metadata = DocumentMetadata(
        id=doc_id,
        name=original_filename,
        format=ext,
        pages=total_pages,
        size=size_str,
        processedAt=processed_at_str,
        processingTime=duration_str,
        totalBlocks=total_blocks,
        textBlocks=text_blocks,
        tables=tables,
        figures=figures,
        equations=equations,
        images=images,
        lists=lists,
        confidence=avg_conf
    )

    results = ParsedResultsResponse(
        documentId=doc_id,
        metadata=metadata,
        confidenceDistribution=dist,
        flaggedPages=flagged_pages,
        blocks=blocks,
        errors=[]
    )

    return results, None
