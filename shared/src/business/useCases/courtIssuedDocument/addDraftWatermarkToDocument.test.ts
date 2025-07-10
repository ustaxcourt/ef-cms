import { addDraftWatermarkToDocument } from './addDraftWatermarkToDocument';

describe('addDraftWatermarkToDocument', () => {
  let mockPdfDoc;
  let mockTextFont;
  let mockApplicationContext;
  let mockPage;

  beforeAll(() => {
    mockPage = {
      getSize: jest.fn(() => ({ width: 600, height: 800 })),
      drawText: jest.fn(),
    };

    mockTextFont = {
      widthOfTextAtSize: jest.fn(() => 400),
    };

    mockPdfDoc = {
      getPages: jest.fn(() => [mockPage]),
      save: jest.fn(() => Promise.resolve('mock-pdf-bytes')),
    };

    mockApplicationContext = {
      getPdfLib: jest.fn(() =>
        Promise.resolve({
          degrees: jest.fn(d => d),
          rgb: jest.fn((r, g, b) => `rgb(${r},${g},${b})`),
        }),
      ),
      getUtilities: jest.fn(() => ({
        setupPdfDocument: jest.fn(() =>
          Promise.resolve({
            pdfDoc: mockPdfDoc,
            textFont: mockTextFont,
          }),
        ),
      })),
    };
  });

  it('adds a watermark to the PDF and returns the updated PDF bytes', async () => {
    const result = await addDraftWatermarkToDocument({
      applicationContext: mockApplicationContext,
      pdfFile: new Uint8Array(),
    });

    expect(mockApplicationContext.getPdfLib).toHaveBeenCalled();
    expect(mockApplicationContext.getUtilities).toHaveBeenCalled();
    expect(mockPdfDoc.getPages).toHaveBeenCalled();
    expect(mockTextFont.widthOfTextAtSize).toHaveBeenCalledWith(
      'DRAFT',
      expect.any(Number),
    );
    expect(mockPage.drawText).toHaveBeenCalledWith(
      'DRAFT',
      expect.objectContaining({
        textFont: mockTextFont,
        size: expect.any(Number),
        x: expect.any(Number),
        y: expect.any(Number),
        color: 'rgb(0,0,0)',
        opacity: 0.15,
        rotate: -15,
      }),
    );
    expect(result).toEqual('mock-pdf-bytes');
  });
});
