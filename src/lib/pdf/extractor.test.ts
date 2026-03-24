import { extractTextFromPdf, PdfExtractionError } from './extractor';

jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn().mockResolvedValue({
        getTextContent: jest.fn().mockResolvedValue({
          items: [{ str: 'Mocked Text Content' }]
        })
      })
    })
  })
}));

describe('PDF Extractor Service', () => {
  it('should successfully extract text from a valid PDF format', async () => {
    // Mock the %PDF- magic bytes required by our implementation
    const validHeader = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D]);
    
    const result = await extractTextFromPdf(validHeader);
    expect(result).toBe('Mocked Text Content');
  });

  it('should throw PdfExtractionError for non-PDF files', async () => {
    const invalidData = Buffer.from('Not a PDF file content');
    
    await expect(extractTextFromPdf(invalidData)).rejects.toThrow(PdfExtractionError);
    await expect(extractTextFromPdf(invalidData)).rejects.toThrow('Unable to extract text from PDF');
  });
});
