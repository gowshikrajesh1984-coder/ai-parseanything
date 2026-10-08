import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  DocumentMetadata,
  ConfidenceDistribution,
  FlaggedPageItem,
  ProcessedDocumentItem,
  ExtractedBlock,
  DocumentValidationError,
  DrawerType,
  ProcessingState,
  ExportFormat,
} from '../types';
import {
  initialDocument,
  defaultConfidenceDistribution,
  defaultFlaggedPages,
  defaultProcessedDocuments,
  initialExtractedBlocks,
  sampleExtractionErrors,
} from '../data/mockData';
import { documentApiService } from '../services/documentApi';

interface DocumentContextType {
  document: DocumentMetadata;
  setDocument: React.Dispatch<React.SetStateAction<DocumentMetadata>>;
  confidenceDistribution: ConfidenceDistribution;
  flaggedPages: FlaggedPageItem[];
  resolveFlaggedPage: (page: number) => void;
  processedDocuments: ProcessedDocumentItem[];
  activeDrawer: DrawerType;
  openDrawer: (type: DrawerType) => void;
  closeDrawer: () => void;
  bookModalOpen: boolean;
  openBookModal: () => void;
  closeBookModal: () => void;
  bookPage: 1 | 2;
  setBookPage: (p: 1 | 2) => void;
  selectedFlaggedPage: number | null;
  setSelectedFlaggedPage: (p: number | null) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  uploadStatus: ProcessingState;
  setUploadStatus: React.Dispatch<React.SetStateAction<ProcessingState>>;
  uploadProgress: number;
  parsingProgress: number;
  parsingStage: string;
  exportFormat: ExportFormat;
  setExportFormat: (f: ExportFormat) => void;
  uploadedFile: File | null;
  uploadedFileUrl: string | null;
  validationError: DocumentValidationError | null;
  clearValidationError: () => void;
  extractedBlocks: ExtractedBlock[];
  extractionErrors: DocumentValidationError[];
  startUpload: (fileInput?: File | { name: string; size: string; type: string }) => Promise<boolean>;
  removeFile: () => void;
  startParsing: (onComplete?: () => void) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<DocumentMetadata>(initialDocument);
  const [confidenceDistribution, setConfidenceDistribution] = useState<ConfidenceDistribution>(defaultConfidenceDistribution);
  const [flaggedPages, setFlaggedPages] = useState<FlaggedPageItem[]>(defaultFlaggedPages);
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocumentItem[]>(defaultProcessedDocuments);
  const [extractedBlocks, setExtractedBlocks] = useState<ExtractedBlock[]>(initialExtractedBlocks);
  const [extractionErrors, setExtractionErrors] = useState<DocumentValidationError[]>(sampleExtractionErrors);

  // File objects & Object URLs for local rendering
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(
    '/src/assets/images/invoice_doc_preview_1791377572904.jpg'
  );
  const currentObjectUrlRef = useRef<string | null>(null);

  // Validation state
  const [validationError, setValidationError] = useState<DocumentValidationError | null>(null);

  // Drawer state
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  // Book modal state
  const [bookModalOpen, setBookModalOpen] = useState<boolean>(false);
  const [bookPage, setBookPage] = useState<1 | 2>(1);

  // Selected flagged page / block in review
  const [selectedFlaggedPage, setSelectedFlaggedPage] = useState<number | null>(3);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-023');

  // Upload & parsing states
  const [uploadStatus, setUploadStatus] = useState<ProcessingState>('uploaded');
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [parsingProgress, setParsingProgress] = useState<number>(0);
  const [parsingStage, setParsingStage] = useState<string>('Ready');

  // Export format selection
  const [exportFormat, setExportFormat] = useState<ExportFormat>('JSON');

  // Polling ref for Celery job
  const pollingIntervalRef = useRef<any>(null);

  // Fetch initial history on mount
  useEffect(() => {
    let isMounted = true;
    documentApiService.getProcessedDocuments().then((docs) => {
      if (isMounted && docs && docs.length > 0) {
        setProcessedDocuments(docs);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  // Keyboard accessibility: ESC closes drawer or book modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (bookModalOpen) {
          setBookModalOpen(false);
        } else if (activeDrawer) {
          setActiveDrawer(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookModalOpen, activeDrawer]);

  const openDrawer = useCallback((type: DrawerType) => {
    setActiveDrawer(type);
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  const openBookModal = useCallback(() => {
    setBookPage(1);
    setBookModalOpen(true);
  }, []);

  const closeBookModal = useCallback(() => {
    setBookModalOpen(false);
  }, []);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  const resolveFlaggedPage = useCallback((pageNumber: number) => {
    setFlaggedPages((prev) =>
      prev.map((item) => {
        if (item.page === pageNumber) {
          const nextResolved = !item.resolved;
          if (document.id) {
            documentApiService.resolveFlag(document.id, pageNumber, nextResolved).catch(() => {});
          }
          return { ...item, resolved: nextResolved };
        }
        return item;
      })
    );
  }, [document.id]);

  const removeFile = useCallback(() => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
    setUploadedFile(null);
    setUploadedFileUrl(null);
    setValidationError(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setParsingProgress(0);
  }, []);

  const startUpload = useCallback(
    async (fileInput?: File | { name: string; size: string; type: string }): Promise<boolean> => {
      setValidationError(null);
      setUploadStatus('uploading');
      setUploadProgress(20);

      try {
        let uploadRes;

        if (fileInput instanceof File) {
          // Pre-validation
          const val = await documentApiService.validate(fileInput);
          if (!val.isValid && val.error) {
            setValidationError(val.error);
            setUploadStatus('idle');
            return false;
          }

          // Revoke prior URL
          if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(currentObjectUrlRef.current);
          }
          const objUrl = URL.createObjectURL(fileInput);
          currentObjectUrlRef.current = objUrl;
          setUploadedFile(fileInput);
          setUploadedFileUrl(objUrl);

          setUploadProgress(60);
          uploadRes = await documentApiService.upload(fileInput);
        } else {
          // Sample file selection
          const sampleName = fileInput?.name || 'Invoice_2025.pdf';
          setUploadProgress(60);
          uploadRes = await documentApiService.uploadSample(sampleName);
          setUploadedFile(null);
          // Set preview URL to backend preview endpoint or local asset
          if (uploadRes.documentId) {
            setUploadedFileUrl(`/api/documents/${uploadRes.documentId}/preview`);
          }
        }

        if (!uploadRes.success || !uploadRes.documentId) {
          setValidationError(
            uploadRes.error || {
              code: 'PARSING_FAILED',
              message: 'Failed to process document upload.',
              field: 'upload',
            }
          );
          setUploadStatus('idle');
          return false;
        }

        setUploadProgress(100);
        setUploadStatus('uploaded');

        const meta = uploadRes.metadata;
        setDocument({
          id: uploadRes.documentId,
          name: meta.name || fileInput?.name || 'Document',
          format: meta.format || 'PDF',
          pages: meta.pages || 1,
          size: meta.size || '1.0 MB',
          processedAt: meta.processedAt || '',
          processingTime: meta.processingTime || '',
          totalBlocks: meta.totalBlocks || 0,
          textBlocks: meta.textBlocks || 0,
          tables: meta.tables || 0,
          figures: meta.figures || 0,
          equations: meta.equations || 0,
          images: meta.images || 0,
          lists: meta.lists || 0,
          confidence: meta.confidence || 95.0,
        });

        return true;
      } catch (err: any) {
        setValidationError({
          code: 'PARSING_FAILED',
          message: err?.message || 'Upload failed',
          field: 'network',
        });
        setUploadStatus('idle');
        return false;
      }
    },
    []
  );

  const startParsing = useCallback(
    (onComplete?: () => void) => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

      setUploadStatus('parsing');
      setParsingProgress(5);
      setParsingStage('Dispatching to Celery worker...');

      const docId = document.id;
      if (!docId) {
        setValidationError({
          code: 'PARSING_FAILED',
          message: 'Document ID missing. Please re-upload.',
          field: 'id',
        });
        setUploadStatus('uploaded');
        return;
      }

      documentApiService.triggerParse(docId)
        .then(({ jobId }) => {
          let pollFailCount = 0;

          pollingIntervalRef.current = setInterval(async () => {
            try {
              const status = await documentApiService.getJobStatus(jobId);
              pollFailCount = 0;

              setParsingProgress(status.progress);
              setParsingStage(status.stage);

              if (status.status === 'completed') {
                clearInterval(pollingIntervalRef.current);
                setUploadStatus('completed');
                setParsingProgress(100);

                // Fetch real results from backend
                try {
                  const results = await documentApiService.getResults(docId);
                  setDocument(results.metadata);
                  setExtractedBlocks(results.blocks);
                  setConfidenceDistribution(results.confidenceDistribution);
                  setFlaggedPages(results.flaggedPages);
                  setExtractionErrors(results.errors || []);

                  if (results.flaggedPages.length > 0) {
                    setSelectedFlaggedPage(results.flaggedPages[0].page);
                    if (results.flaggedPages[0].blockId) {
                      setSelectedBlockId(results.flaggedPages[0].blockId);
                    }
                  }

                  // Refresh history list
                  const updatedDocs = await documentApiService.getProcessedDocuments();
                  if (updatedDocs && updatedDocs.length > 0) {
                    setProcessedDocuments(updatedDocs);
                  }
                } catch (fetchErr) {
                  console.error('Error fetching completed results:', fetchErr);
                }

                // Open book modal on completion after green confirmation
                setTimeout(() => {
                  setBookPage(1);
                  setBookModalOpen(true);
                  if (onComplete) onComplete();
                }, 850);
              } else if (status.status === 'failed') {
                clearInterval(pollingIntervalRef.current);
                setUploadStatus('uploaded');
                setValidationError(
                  status.error || {
                    code: 'PARSING_FAILED',
                    message: status.stage || 'Document parsing encountered a fatal error.',
                  }
                );
              }
            } catch (err) {
              pollFailCount++;
              if (pollFailCount > 8) {
                clearInterval(pollingIntervalRef.current);
                setUploadStatus('uploaded');
                setValidationError({
                  code: 'PARSING_FAILED',
                  message: 'Lost connection to Celery worker while polling job progress.',
                });
              }
            }
          }, 350);
        })
        .catch((err) => {
          setUploadStatus('uploaded');
          setValidationError({
            code: 'PARSING_FAILED',
            message: err?.message || 'Failed to trigger parsing pipeline.',
          });
        });
    },
    [document.id]
  );

  return (
    <DocumentContext.Provider
      value={{
        document,
        setDocument,
        confidenceDistribution,
        flaggedPages,
        resolveFlaggedPage,
        processedDocuments,
        activeDrawer,
        openDrawer,
        closeDrawer,
        bookModalOpen,
        openBookModal,
        closeBookModal,
        bookPage,
        setBookPage,
        selectedFlaggedPage,
        setSelectedFlaggedPage,
        selectedBlockId,
        setSelectedBlockId,
        uploadStatus,
        setUploadStatus,
        uploadProgress,
        parsingProgress,
        parsingStage,
        exportFormat,
        setExportFormat,
        uploadedFile,
        uploadedFileUrl,
        validationError,
        clearValidationError,
        extractedBlocks,
        extractionErrors,
        startUpload,
        removeFile,
        startParsing,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
