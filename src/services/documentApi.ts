import {
  DocumentMetadata,
  ExtractedBlock,
  DocumentValidationError,
  ProcessingState,
  ConfidenceDistribution,
  FlaggedPageItem,
  ProcessedDocumentItem,
} from '../types';
import { validateDocumentFile } from '../utils/fileValidation';

export interface UploadResponse {
  success: boolean;
  documentId: string;
  metadata: Partial<DocumentMetadata>;
  error?: DocumentValidationError;
}

export interface ParseJobStatus {
  jobId: string;
  documentId: string;
  stage: string;
  progress: number;
  status: ProcessingState;
  completedAt?: string;
  error?: DocumentValidationError;
}

export interface ParsedResultsResponse {
  documentId: string;
  metadata: DocumentMetadata;
  confidenceDistribution: ConfidenceDistribution;
  flaggedPages: FlaggedPageItem[];
  blocks: ExtractedBlock[];
  errors: DocumentValidationError[];
}

export const documentApiService = {
  /**
   * Client-side validation prior to transmission
   */
  async validate(file: File): Promise<{ isValid: boolean; error?: DocumentValidationError }> {
    return await validateDocumentFile(file);
  },

  /**
   * Uploads real document file to FastAPI backend: POST /api/documents/upload
   */
  async upload(file: File): Promise<UploadResponse> {
    const valResult = await this.validate(file);
    if (!valResult.isValid) {
      return {
        success: false,
        documentId: '',
        metadata: {},
        error: valResult.error,
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return {
          success: false,
          documentId: '',
          metadata: {},
          error: errJson.error || {
            code: 'PARSING_FAILED',
            message: errJson.detail || 'Upload request failed',
            field: 'upload',
          },
        };
      }

      return await response.json();
    } catch (err: any) {
      return {
        success: false,
        documentId: '',
        metadata: {},
        error: {
          code: 'PARSING_FAILED',
          message: err?.message || 'Network connection failed during upload',
          field: 'network',
        },
      };
    }
  },

  /**
   * Uploads or activates a sample document from the backend
   */
  async uploadSample(sampleName: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('sampleName', sampleName);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return {
          success: false,
          documentId: '',
          metadata: {},
          error: errJson.error || {
            code: 'PARSING_FAILED',
            message: errJson.detail || 'Failed to initialize sample file',
          },
        };
      }

      return await response.json();
    } catch (err: any) {
      return {
        success: false,
        documentId: '',
        metadata: {},
        error: {
          code: 'PARSING_FAILED',
          message: err?.message || 'Network error on sample upload',
        },
      };
    }
  },

  /**
   * Dispatches Celery parsing job: POST /api/documents/{documentId}/parse
   */
  async triggerParse(documentId: string): Promise<{ jobId: string; status: string }> {
    const response = await fetch(`/api/documents/${documentId}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || 'Failed to dispatch parsing job');
    }

    return await response.json();
  },

  /**
   * Polls real Celery job status: GET /api/jobs/{jobId}/status
   */
  async getJobStatus(jobId: string): Promise<ParseJobStatus> {
    const response = await fetch(`/api/jobs/${jobId}/status`);
    if (!response.ok) {
      throw new Error(`Job status error: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Fetches real parsed results: GET /api/documents/{documentId}/results
   */
  async getResults(documentId: string): Promise<ParsedResultsResponse> {
    const response = await fetch(`/api/documents/${documentId}/results`);
    if (!response.ok) {
      throw new Error(`Failed to fetch parsed results: ${response.statusText}`);
    }
    return await response.json();
  },

  /**
   * Lists processed documents: GET /api/documents
   */
  async getProcessedDocuments(): Promise<ProcessedDocumentItem[]> {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },

  /**
   * Resolves a flagged page: POST /api/documents/{documentId}/flagged/{pageNumber}/resolve
   */
  async resolveFlag(documentId: string, pageNumber: number, resolved = true): Promise<boolean> {
    try {
      const response = await fetch(`/api/documents/${documentId}/flagged/${pageNumber}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
