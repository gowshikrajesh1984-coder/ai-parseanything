from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class DocumentErrorCode(str, Enum):
    INVALID_FILE_TYPE = "INVALID_FILE_TYPE"
    FILE_TOO_LARGE = "FILE_TOO_LARGE"
    CORRUPTED_FILE = "CORRUPTED_FILE"
    INVALID_FILE_STRUCTURE = "INVALID_FILE_STRUCTURE"
    UNSUPPORTED_FORMAT = "UNSUPPORTED_FORMAT"
    EMPTY_FILE = "EMPTY_FILE"
    PARSING_FAILED = "PARSING_FAILED"
    EXTRACTION_FAILED = "EXTRACTION_FAILED"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"
    VALIDATION_FAILED = "VALIDATION_FAILED"
    IMAGE_EXTRACTION_FAILED = "IMAGE_EXTRACTION_FAILED"
    EQUATION_NOT_DETECTED = "EQUATION_NOT_DETECTED"
    TABLE_STRUCTURE_UNCLEAR = "TABLE_STRUCTURE_UNCLEAR"

class BlockType(str, Enum):
    TEXT = "TEXT"
    TABLE = "TABLE"
    FIGURE = "FIGURE"
    IMAGE = "IMAGE"
    EQUATION = "EQUATION"
    LIST = "LIST"
    METADATA = "METADATA"

class ValidationStatus(str, Enum):
    VALID = "valid"
    NEEDS_REVIEW = "needs_review"
    REJECTED = "rejected"

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class TableDetails(BaseModel):
    rows: int
    columns: int
    headers: List[str] = Field(default_factory=list)
    cells: List[List[str]] = Field(default_factory=list)

class DocumentValidationError(BaseModel):
    code: DocumentErrorCode
    message: str
    field: Optional[str] = None
    pageNumber: Optional[int] = None
    blockId: Optional[str] = None
    confidence: Optional[float] = None
    requiresHumanReview: Optional[bool] = False

class ExtractedBlock(BaseModel):
    id: str
    type: BlockType
    content: str
    confidence: float  # Scale 0.0 - 1.0 or 0 - 100
    pageNumber: int
    boundingBox: BoundingBox
    readingOrder: int
    validationStatus: ValidationStatus = ValidationStatus.VALID
    sourceDocumentId: Optional[str] = None
    requiresHumanReview: Optional[bool] = False
    issue: Optional[str] = None
    tableDetails: Optional[TableDetails] = None

class DocumentMetadata(BaseModel):
    id: Optional[str] = None
    name: str
    format: str
    pages: int
    size: str
    processedAt: str = ""
    processingTime: str = ""
    totalBlocks: int = 0
    textBlocks: int = 0
    tables: int = 0
    figures: int = 0
    equations: int = 0
    images: int = 0
    lists: int = 0
    confidence: float = 0.0

class ConfidenceDistribution(BaseModel):
    high: int  # 90-100%
    medium: int  # 70-89%
    low: int  # 50-69%
    veryLow: int  # <50%

class FlaggedPageItem(BaseModel):
    page: int
    issue: str
    confidence: float
    blockId: Optional[str] = None
    boundingBox: Optional[BoundingBox] = None
    details: Optional[str] = None
    resolved: bool = False

class ProcessedDocumentItem(BaseModel):
    id: str
    name: str
    type: str
    size: str
    date: str
    time: str
    status: str  # 'Processed' | 'Pending' | 'Flagged'
    confidence: float
    pages: int

class UploadResponse(BaseModel):
    success: bool
    documentId: str
    metadata: DocumentMetadata
    error: Optional[DocumentValidationError] = None

class TriggerParseRequest(BaseModel):
    documentId: Optional[str] = None

class TriggerParseResponse(BaseModel):
    jobId: str
    documentId: str
    status: str
    message: str

class JobStatusResponse(BaseModel):
    jobId: str
    documentId: str
    status: str  # 'idle' | 'uploading' | 'uploaded' | 'parsing' | 'completed' | 'failed'
    progress: int
    stage: str
    completedAt: Optional[str] = None
    error: Optional[DocumentValidationError] = None

class ParsedResultsResponse(BaseModel):
    documentId: str
    metadata: DocumentMetadata
    confidenceDistribution: ConfidenceDistribution
    flaggedPages: List[FlaggedPageItem]
    blocks: List[ExtractedBlock]
    errors: List[DocumentValidationError] = Field(default_factory=list)

class ResolveFlagRequest(BaseModel):
    resolved: bool = True

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str

class DetailedHealthResponse(BaseModel):
    status: str
    service: str
    redis: str
    celery: str
    storage: str
    version: str
    timestamp: str
