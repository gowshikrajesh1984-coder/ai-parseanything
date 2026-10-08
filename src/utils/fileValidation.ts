import { DocumentValidationError, DocumentErrorCode } from '../types';

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const SUPPORTED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'] as const;

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Validates the file buffer magic bytes/signatures.
 * Returns true if valid for the claimed type, false if mismatch or corrupt.
 */
export async function validateFileSignature(
  file: File
): Promise<{ valid: boolean; detectedType?: string; error?: DocumentValidationError }> {
  try {
    const slice = file.slice(0, 16);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (bytes.length < 4) {
      return {
        valid: false,
        error: {
          code: 'EMPTY_FILE',
          message: 'The selected file is empty (0 bytes).',
          field: 'integrity',
        },
      };
    }

    // PDF magic bytes: %PDF (0x25, 0x50, 0x44, 0x46)
    const isPdf =
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46;

    // PNG magic bytes: \x89PNG\r\n\x1a\n (0x89, 0x50, 0x4E, 0x47)
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47;

    // JPEG magic bytes: 0xFF, 0xD8, 0xFF
    const isJpeg =
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;

    // DOCX is a zip file: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    const isZipDocx =
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      bytes[2] === 0x03 &&
      bytes[3] === 0x04;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      if (!isPdf) {
        return {
          valid: false,
          error: {
            code: 'CORRUPTED_FILE',
            message: 'File appears to be corrupted or invalid. Missing valid PDF header signature.',
            field: 'integrity',
          },
        };
      }
      return { valid: true, detectedType: 'PDF' };
    }

    if (ext === 'png') {
      if (!isPng) {
        return {
          valid: false,
          error: {
            code: 'CORRUPTED_FILE',
            message: 'File appears to be corrupted or invalid. Invalid PNG binary signature.',
            field: 'integrity',
          },
        };
      }
      return { valid: true, detectedType: 'PNG' };
    }

    if (ext === 'jpg' || ext === 'jpeg') {
      if (!isJpeg) {
        return {
          valid: false,
          error: {
            code: 'CORRUPTED_FILE',
            message: 'File appears to be corrupted or invalid. Invalid JPEG binary signature.',
            field: 'integrity',
          },
        };
      }
      return { valid: true, detectedType: 'JPG' };
    }

    if (ext === 'docx') {
      if (!isZipDocx) {
        return {
          valid: false,
          error: {
            code: 'INVALID_FILE_STRUCTURE',
            message: 'DOCX file must have a valid OpenXML container structure.',
            field: 'structure',
          },
        };
      }
      return { valid: true, detectedType: 'DOCX' };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: {
        code: 'CORRUPTED_FILE',
        message: 'Unable to read this file. File appears to be corrupted or unreadable.',
        field: 'integrity',
      },
    };
  }
}

/**
 * Comprehensive pre-parsing client-side document validation.
 */
export async function validateDocumentFile(
  file: File
): Promise<{ isValid: boolean; error?: DocumentValidationError }> {
  // 1. Check file existence and empty file
  if (!file || file.size === 0) {
    return {
      isValid: false,
      error: {
        code: 'EMPTY_FILE',
        message: 'The selected file is empty or missing.',
        field: 'size',
      },
    };
  }

  // 2. Check file size limit (MAX 25 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File exceeds the maximum allowed size of 25 MB.',
        field: 'size',
      },
    };
  }

  // 3. Check filename extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !SUPPORTED_EXTENSIONS.includes(ext as any)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: `Unsupported file type. Please upload a PDF, JPG, PNG, or DOCX document.`,
        field: 'type',
      },
    };
  }

  // 4. Inspect file binary signatures
  const sigCheck = await validateFileSignature(file);
  if (!sigCheck.valid) {
    return {
      isValid: false,
      error: sigCheck.error || {
        code: 'CORRUPTED_FILE',
        message: 'File appears to be corrupted or invalid.',
        field: 'integrity',
      },
    };
  }

  return { isValid: true };
}
