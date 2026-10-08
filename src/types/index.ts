export type DocumentErrorCode =
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'CORRUPTED_FILE'
  | 'INVALID_FILE_STRUCTURE'
  | 'UNSUPPORTED_FORMAT'
  | 'EMPTY_FILE'
  | 'PARSING_FAILED'
  | 'EXTRACTION_FAILED'
  | 'LOW_CONFIDENCE'
  | 'VALIDATION_FAILED'
  | 'IMAGE_EXTRACTION_FAILED'
  | 'EQUATION_NOT_DETECTED'
  | 'TABLE_STRUCTURE_UNCLEAR';

export interface DocumentValidationError {
  code: DocumentErrorCode;
  message: string;
  field?: string;
  pageNumber?: number;
  blockId?: string;
  confidence?: number;
  requiresHumanReview?: boolean;
}

export type BlockType =
  | 'TEXT'
  | 'TABLE'
  | 'FIGURE'
  | 'IMAGE'
  | 'EQUATION'
  | 'LIST'
  | 'METADATA';

export type ValidationStatus = 'valid' | 'needs_review' | 'rejected';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedBlock {
  id: string;
  type: BlockType;
  content: string;
  confidence: number;
  pageNumber: number;
  boundingBox: BoundingBox;
  readingOrder: number;
  validationStatus: ValidationStatus;
  sourceDocumentId?: string;
  requiresHumanReview?: boolean;
  issue?: string;
  tableDetails?: {
    rows: number;
    columns: number;
    headers: string[];
    cells: string[][];
  };
}

export interface DocumentMetadata {
  id?: string;
  name: string;
  format: string;
  pages: number;
  size: string;
  processedAt: string;
  processingTime: string;
  totalBlocks: number;
  textBlocks: number;
  tables: number;
  figures: number;
  equations: number;
  images: number;
  lists: number;
  confidence: number;
}

export interface ConfidenceDistribution {
  high: number; // 90-100%
  medium: number; // 70-89%
  low: number; // 50-69%
  veryLow: number; // <50%
}

export interface FlaggedPageItem {
  page: number;
  issue: string;
  confidence: number;
  blockId?: string;
  boundingBox?: BoundingBox;
  details?: string;
  resolved?: boolean;
}

export interface ProcessedDocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  time: string;
  status: 'Processed' | 'Pending' | 'Flagged';
  confidence: number;
  pages: number;
}

export type ExportFormat = 'JSON' | 'Markdown' | 'Structured';

export type DrawerType = 'documents' | 'confidence' | 'review' | null;

export type ProcessingState = 'idle' | 'uploading' | 'uploaded' | 'parsing' | 'completed' | 'failed';
