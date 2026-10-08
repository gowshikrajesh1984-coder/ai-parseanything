import {
  DocumentMetadata,
  ConfidenceDistribution,
  FlaggedPageItem,
  ProcessedDocumentItem,
  ExtractedBlock,
  DocumentValidationError,
} from '../types';

export const initialDocument: DocumentMetadata = {
  id: "doc-2025-001",
  name: "Invoice_2025.pdf",
  format: "PDF",
  pages: 5,
  size: "2.4 MB",
  processedAt: "Apr 26, 2025 • 10:32 AM",
  processingTime: "12.6 seconds",
  totalBlocks: 48,
  textBlocks: 32,
  tables: 5,
  figures: 4,
  equations: 2,
  images: 3,
  lists: 2,
  confidence: 92.4,
};

export const defaultConfidenceDistribution: ConfidenceDistribution = {
  high: 68,
  medium: 22,
  low: 7,
  veryLow: 3,
};

export const defaultFlaggedPages: FlaggedPageItem[] = [
  {
    page: 3,
    issue: "Low confidence",
    confidence: 52,
    blockId: "block-023",
    boundingBox: { x: 120, y: 350, width: 420, height: 80 },
    details: "Handwritten notation near billing header could not be verified with high certainty.",
    resolved: false,
  },
  {
    page: 7,
    issue: "Table structure unclear",
    confidence: 61,
    blockId: "block-031",
    boundingBox: { x: 90, y: 180, width: 480, height: 260 },
    details: "Merged multi-column headers in tax schedule require human row alignment validation.",
    resolved: false,
  },
  {
    page: 12,
    issue: "Image extraction issue",
    confidence: 48,
    blockId: "block-042",
    boundingBox: { x: 150, y: 410, width: 220, height: 110 },
    details: "Low-DPI raster scan of vendor authorization stamp may contain artifacting.",
    resolved: false,
  },
  {
    page: 16,
    issue: "Equation not detected",
    confidence: 55,
    blockId: "block-058",
    boundingBox: { x: 110, y: 290, width: 380, height: 65 },
    details: "Mathematical glyph in early discount amortization formula parsed as inline text.",
    resolved: false,
  },
  {
    page: 21,
    issue: "Mixed content",
    confidence: 62,
    blockId: "block-077",
    boundingBox: { x: 80, y: 140, width: 500, height: 320 },
    details: "Overlapping watermark text across terms and conditions section detected.",
    resolved: false,
  },
];

export const defaultProcessedDocuments: ProcessedDocumentItem[] = [
  {
    id: "doc-1",
    name: "Application_Form.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "Apr 26, 2025",
    time: "10:32 AM",
    status: "Processed",
    confidence: 95.8,
    pages: 4,
  },
  {
    id: "doc-2",
    name: "ID_Proof.jpg",
    type: "Image",
    size: "1.8 MB",
    date: "Apr 26, 2025",
    time: "10:28 AM",
    status: "Processed",
    confidence: 91.2,
    pages: 1,
  },
  {
    id: "doc-3",
    name: "Resume.pdf",
    type: "PDF",
    size: "3.1 MB",
    date: "Apr 26, 2025",
    time: "10:24 AM",
    status: "Processed",
    confidence: 97.4,
    pages: 2,
  },
  {
    id: "doc-4",
    name: "Address_Proof.png",
    type: "Image",
    size: "2.2 MB",
    date: "Apr 26, 2025",
    time: "10:20 AM",
    status: "Processed",
    confidence: 88.6,
    pages: 1,
  },
  {
    id: "doc-5",
    name: "Additional_Doc.pdf",
    type: "PDF",
    size: "1.5 MB",
    date: "Apr 26, 2025",
    time: "10:15 AM",
    status: "Processed",
    confidence: 94.0,
    pages: 3,
  },
];

export const initialExtractedBlocks: ExtractedBlock[] = [
  {
    id: "block-001",
    type: "METADATA",
    content: "Invoice Number: INV-2025-9842",
    confidence: 0.98,
    pageNumber: 1,
    boundingBox: { x: 50, y: 40, width: 240, height: 35 },
    readingOrder: 1,
    validationStatus: "valid",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-002",
    type: "TEXT",
    content: "Vendor: Apex Global Technologies Inc. • Tax ID: US-94-2819401",
    confidence: 0.96,
    pageNumber: 1,
    boundingBox: { x: 50, y: 85, width: 380, height: 40 },
    readingOrder: 2,
    validationStatus: "valid",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-003",
    type: "TABLE",
    content: "Line Items Table: 3 Services, Subtotal $18,450.00",
    confidence: 0.95,
    pageNumber: 1,
    boundingBox: { x: 50, y: 150, width: 500, height: 180 },
    readingOrder: 3,
    validationStatus: "valid",
    sourceDocumentId: "doc-2025-001",
    tableDetails: {
      rows: 4,
      columns: 4,
      headers: ["Item Description", "Qty", "Unit Price", "Total"],
      cells: [
        ["Cloud Infrastructure Cluster (Q2)", "3", "$4,200.00", "$12,600.00"],
        ["AI Model Fine-Tuning & Ingestion Pipeline", "1", "$3,850.00", "$3,850.00"],
        ["Dedicated SLA Support & Monitoring", "2", "$1,000.00", "$2,000.00"],
      ],
    },
  },
  {
    id: "block-023",
    type: "TEXT",
    content: "Handwritten Billing Annotation: [Illegible notation verified]",
    confidence: 0.52,
    pageNumber: 3,
    boundingBox: { x: 120, y: 350, width: 420, height: 80 },
    readingOrder: 8,
    validationStatus: "needs_review",
    requiresHumanReview: true,
    issue: "Low confidence",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-031",
    type: "TABLE",
    content: "Tax Breakdown Schedule Table (Merged Multi-column columns)",
    confidence: 0.61,
    pageNumber: 7,
    boundingBox: { x: 90, y: 180, width: 480, height: 260 },
    readingOrder: 14,
    validationStatus: "needs_review",
    requiresHumanReview: true,
    issue: "Table structure unclear",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-042",
    type: "IMAGE",
    content: "Vendor Corporate Seal / Raster Stamp",
    confidence: 0.48,
    pageNumber: 12,
    boundingBox: { x: 150, y: 410, width: 220, height: 110 },
    readingOrder: 22,
    validationStatus: "needs_review",
    requiresHumanReview: true,
    issue: "Image extraction issue",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-058",
    type: "EQUATION",
    content: "Amortization formula: d = r * (1 - (1+i)^-n) / i",
    confidence: 0.55,
    pageNumber: 16,
    boundingBox: { x: 110, y: 290, width: 380, height: 65 },
    readingOrder: 31,
    validationStatus: "needs_review",
    requiresHumanReview: true,
    issue: "Equation not detected",
    sourceDocumentId: "doc-2025-001",
  },
  {
    id: "block-077",
    type: "TEXT",
    content: "Confidential Watermark Layer & General Legal Terms § 14.2",
    confidence: 0.62,
    pageNumber: 21,
    boundingBox: { x: 80, y: 140, width: 500, height: 320 },
    readingOrder: 40,
    validationStatus: "needs_review",
    requiresHumanReview: true,
    issue: "Mixed content",
    sourceDocumentId: "doc-2025-001",
  },
];

export const sampleExtractionErrors: DocumentValidationError[] = [
  {
    code: "LOW_CONFIDENCE",
    message: "Extracted text confidence is below configured threshold (0.70).",
    pageNumber: 3,
    blockId: "block-023",
    confidence: 0.52,
    requiresHumanReview: true,
  },
  {
    code: "TABLE_STRUCTURE_UNCLEAR",
    message: "The table structure could not be reliably determined without human column confirmation.",
    pageNumber: 7,
    confidence: 0.61,
    requiresHumanReview: true,
  },
  {
    code: "IMAGE_EXTRACTION_FAILED",
    message: "Authorization seal scan contains high raster compression artifacts.",
    pageNumber: 12,
    confidence: 0.48,
    requiresHumanReview: true,
  },
  {
    code: "EQUATION_NOT_DETECTED",
    message: "Mathematical equation glyph unrecognized by font symbol dictionary.",
    pageNumber: 16,
    confidence: 0.55,
    requiresHumanReview: true,
  },
];

export const sampleExportData = {
  json: JSON.stringify(
    {
      document: {
        name: "Invoice_2025.pdf",
        format: "PDF",
        pages: 5,
        size: "2.4 MB",
        processedAt: "2025-04-26T10:32:00Z",
        overallConfidence: 0.924,
      },
      blocks: initialExtractedBlocks,
      errors: sampleExtractionErrors,
    },
    null,
    2
  ),
  markdown: `# ParseAnything Extracted Document Report

**Document:** Invoice_2025.pdf  
**Extraction Date:** Apr 26, 2025 • 10:32 AM  
**Confidence Score:** 92.4%  
**Pages:** 5  

---

## 1. Summary Information
- **Invoice Number:** INV-2025-9842
- **Vendor:** Apex Global Technologies Inc.
- **Client:** Vanguard Enterprise Solutions
- **Total Due:** $20,018.25 USD

---

## 2. Line Items Table (Block ID: block-003, Page 1)

| Item Description | Qty | Unit Price | Total Amount | Confidence |
| :--- | :--- | :--- | :--- | :--- |
| Cloud Infrastructure Cluster (Q2) | 3 | $4,200.00 | $12,600.00 | 98% |
| AI Model Fine-Tuning & Ingestion Pipeline | 1 | $3,850.00 | $3,850.00 | 94% |
| Dedicated SLA Support & Monitoring | 2 | $1,000.00 | $2,000.00 | 99% |

---

## 3. Financial Totals
- **Subtotal:** $18,450.00
- **Tax (8.5%):** $1,568.25
- **Grand Total:** **$20,018.25 USD**

---

## 4. Human Review Audit Log
- **Page 3 (block-023):** Low confidence (52%) - Handwritten notation near billing header.
- **Page 7 (block-031):** Table structure unclear (61%) - Merged headers require human review.
- **Page 12 (block-042):** Image extraction issue (48%) - Raster seal scan.
- **Page 16 (block-058):** Equation not detected (55%) - Amortization formula glyph.
- **Page 21 (block-077):** Mixed content (62%) - Watermark text overlap.
`,
  csv: `Block ID,Page,Type,Content,Confidence,Validation Status
"block-001",1,METADATA,"Invoice Number: INV-2025-9842",0.98,valid
"block-002",1,TEXT,"Vendor: Apex Global Technologies Inc.",0.96,valid
"block-003",1,TABLE,"Cloud Infrastructure Cluster (Q2) (Qty: 3)",0.95,valid
"block-023",3,TEXT,"Handwritten Billing Annotation",0.52,needs_review
"block-031",7,TABLE,"Tax Breakdown Schedule Table",0.61,needs_review
"block-042",12,IMAGE,"Vendor Corporate Seal",0.48,needs_review
"block-058",16,EQUATION,"Amortization formula",0.55,needs_review
"block-077",21,TEXT,"Watermark Legal Terms",0.62,needs_review`,
};
