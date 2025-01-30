import { PDFDocument } from 'pdf-lib';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { combineAllPdfDocuments } from '@shared/business/utilities/documentGenerators/combineAllPdfDocuments';

describe('combineAllPdfDocuments', () => {
  it('should merge all the PDF Documents into one', async () => {
    const NUMBER_OF_CASES = 4;
    const TEST_PDFS = Array.from({ length: NUMBER_OF_CASES }, (_, index) => {
      return {
        getPageIndices: () =>
          Array.from(
            { length: index + 1 },
            (_temp, subIndex) => `${index + 1}_${subIndex + 1}`,
          ),
        index,
      } as unknown as PDFDocument;
    });

    const CreateMock = {
      addPage: jest.fn(),
      copyPages: jest.fn().mockImplementation((_pdfDoc, pdfPages) => pdfPages),
    };

    const PDFDocumentMock = {
      create: jest.fn().mockReturnValue(CreateMock),
    };

    applicationContext.getPdfLib = () => {
      return {
        PDFDocument: PDFDocumentMock,
      };
    };

    const results = await combineAllPdfDocuments(applicationContext, TEST_PDFS);

    expect(results).toBe(CreateMock);

    const copyPagesCalls = CreateMock.copyPages.mock.calls;
    expect(copyPagesCalls.length).toBe(NUMBER_OF_CASES);

    const [[, case1Pages], [, case2Pages], [, case3Pages], [, case4Pages]] =
      copyPagesCalls;
    expect(case1Pages).toEqual(['1_1']);
    expect(case2Pages).toEqual(['2_1', '2_2']);
    expect(case3Pages).toEqual(['3_1', '3_2', '3_3']);
    expect(case4Pages).toEqual(['4_1', '4_2', '4_3', '4_4']);

    const addPageCalls = CreateMock.addPage.mock.calls;
    expect(addPageCalls.length).toBe(10);
    expect(addPageCalls).toEqual([
      ['1_1'],
      ['2_1'],
      ['2_2'],
      ['3_1'],
      ['3_2'],
      ['3_3'],
      ['4_1'],
      ['4_2'],
      ['4_3'],
      ['4_4'],
    ]);
  });

  it('should return empty PDF document if length of PDF document is 0', async () => {
    const CreateMock = {
      addPage: jest.fn(),
      copyPages: jest.fn().mockImplementation((_pdfDoc, pdfPages) => pdfPages),
    };

    const PDFDocumentMock = {
      create: jest.fn().mockReturnValue(CreateMock),
    };

    applicationContext.getPdfLib = () => {
      return {
        PDFDocument: PDFDocumentMock,
      };
    };

    const results = await combineAllPdfDocuments(applicationContext, []);

    expect(results).toBe(CreateMock);

    const copyPagesCalls = CreateMock.copyPages.mock.calls;
    expect(copyPagesCalls.length).toBe(0);
  });

  it('should return the only PDF in the array', async () => {
    const TEST_PDFS = Array.from({ length: 1 }, (_, index) => {
      return {
        getPageIndices: () =>
          Array.from(
            { length: index + 1 },
            (_temp, subIndex) => `${index + 1}_${subIndex + 1}`,
          ),
        index,
      } as unknown as PDFDocument;
    });

    const CreateMock = {
      addPage: jest.fn(),
      copyPages: jest.fn().mockImplementation((_pdfDoc, pdfPages) => pdfPages),
    };

    const PDFDocumentMock = {
      create: jest.fn().mockReturnValue(CreateMock),
    };

    applicationContext.getPdfLib = () => {
      return {
        PDFDocument: PDFDocumentMock,
      };
    };

    const results = await combineAllPdfDocuments(applicationContext, TEST_PDFS);

    expect(results).toBe(TEST_PDFS[0]);

    const copyPagesCalls = CreateMock.copyPages.mock.calls;
    expect(copyPagesCalls.length).toBe(0);
  });
});
