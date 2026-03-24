import * as pdfjsLib from 'pdfjs-dist';
import pino from 'pino';

const logger = pino();

export class PdfExtractionError extends Error {
  constructor(message: string, public code: 'ENCRYPTED' | 'NO_TEXT' | 'CORRUPTED') {
    super(message);
    this.name = 'PdfExtractionError';
  }
}

/**
 * Extracts text from a PDF buffer using pdfjs-dist.
 * 
 * @param buffer - The PDF file buffer
 * @returns The extracted text content
 * @throws {PdfExtractionError} With specific codes for business logic handling
 */
export async function extractTextFromPdf(buffer: Buffer | Uint8Array): Promise<string> {
  try {
    const data = new Uint8Array(buffer);
    
    // Check magic number to ensure it's a PDF (%PDF- is 0x25, 0x50, 0x44, 0x46, 0x2D)
    if (data.length < 5 || data[0] !== 0x25 || data[1] !== 0x50 || data[2] !== 0x44 || data[3] !== 0x46) {
      throw new PdfExtractionError('Unable to extract text from PDF. File may be corrupted or contain only scanned images.', 'CORRUPTED');
    }

    const document = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }

    const cleanText = fullText.trim();
    if (!cleanText) {
      throw new PdfExtractionError('Resume contains no extractable text. Please ensure the PDF contains text (not just scanned images).', 'NO_TEXT');
    }

    return cleanText;
  } catch (error: any) {
    if (error instanceof PdfExtractionError) {
      throw error;
    }

    // pdfjs-dist throws errors containing 'Password' for encrypted files
    if (error?.name === 'PasswordException' || error?.message?.toLowerCase().includes('password')) {
      logger.warn({ err: error }, 'Encrypted PDF upload detected');
      throw new PdfExtractionError('PDF is password-protected. Please unlock the file and re-upload.', 'ENCRYPTED');
    }

    logger.error({ err: error }, 'Failed to extract text from PDF');
    throw new PdfExtractionError('Unable to extract text from PDF. File may be corrupted or contain only scanned images.', 'CORRUPTED');
  }
}
