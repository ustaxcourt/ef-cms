import { addCoverToPdf } from './addCoverToPdf';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { MOCK_CASE } from '@shared/test/mockCase';

describe('addCoverToPdf', () => {
  let mockPdfDoc;
  let mockCoverPageDocument;
  let mockPdfData;

  const testingCaseData = {
    ...MOCK_CASE,
    caseCaption: 'Test Caption, Petitioner',
    initialCaption: 'Test Initial Caption, Petitioner',
    initialDocketNumberSuffix: '_',
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
      },
    ],
  };

  beforeEach(() => {
    mockPdfData = Buffer.from('mock pdf data');

    mockPdfDoc = {
      copyPages: jest.fn().mockResolvedValue([{ page: 'mockPage' }]),
      getPageCount: jest.fn().mockReturnValue(5),
      insertPage: jest.fn(),
      save: jest.fn().mockResolvedValue(Buffer.from('new pdf data')),
    };

    mockCoverPageDocument = {
      getPageIndices: jest.fn().mockReturnValue([0]),
    };

    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest
          .fn()
          .mockResolvedValueOnce(mockPdfDoc)
          .mockResolvedValueOnce(mockCoverPageDocument),
      },
    });

    applicationContext.getDocumentGenerators = jest.fn().mockReturnValue({
      coverSheet: jest.fn().mockResolvedValue(Buffer.from('cover sheet pdf')),
    });
  });

  it('should generate a coversheet and prepend it to the PDF', async () => {
    const result = await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
    } as any);

    expect(result.pdfData).toBeDefined();
    expect(result.numberOfPages).toBe(5);
    expect(mockPdfDoc.insertPage).toHaveBeenCalledWith(0, { page: 'mockPage' });
    expect(mockPdfDoc.save).toHaveBeenCalled();
  });

  it('should call generateCoverSheetData with correct parameters', async () => {
    await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
  });

  it('should handle useInitialData parameter', async () => {
    const result = await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
      useInitialData: true,
    } as any);

    expect(result.pdfData).toBeDefined();
    expect(result.numberOfPages).toBe(5);
  });

  it('should handle filingDateUpdated parameter', async () => {
    const filingDateUpdated = '2023-05-01';

    const result = await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      filingDateUpdated,
      pdfData: mockPdfData,
    } as any);

    expect(result.pdfData).toBeDefined();
    expect(result.numberOfPages).toBe(5);
  });

  it('should return consolidatedCases from coverSheetData', async () => {
    const result = await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
    } as any);

    expect(result).toHaveProperty('consolidatedCases');
  });

  it('should copy pages from cover sheet to main document', async () => {
    await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
    } as any);

    expect(mockPdfDoc.copyPages).toHaveBeenCalledWith(
      mockCoverPageDocument,
      [0],
    );
  });

  it('should load PDF documents correctly', async () => {
    const { PDFDocument } = await applicationContext.getPdfLib();

    await addCoverToPdf({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      pdfData: mockPdfData,
    } as any);

    expect(PDFDocument.load).toHaveBeenCalledTimes(2);
    expect(PDFDocument.load).toHaveBeenCalledWith(mockPdfData);
    expect(PDFDocument.load).toHaveBeenCalledWith(
      Buffer.from('cover sheet pdf'),
    );
  });
});
