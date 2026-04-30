const mockGetDocument = jest.fn();
jest.mock('@shared/business/utilities/pdfs/getPdfJs', () => {
  return {
    getPdfJs: () => ({ getDocument: mockGetDocument }),
  };
});
import { PDFDocument } from 'pdf-lib';
import { applicationContext } from '../test/createTestApplicationContext';
import { loadPDFForSigningInteractor } from './loadPDFForSigningInteractor';
import { testPdfDoc } from '../test/getFakeFile';

const removePageMock = jest.fn();
const saveMock = jest.fn();
const fakePdfPages = ['page1', 'page2'];
const getPagesMock = jest.fn().mockReturnValue(fakePdfPages);

describe('loadPDFForSigningInteractor', () => {
  beforeEach(() => {
    mockGetDocument.mockReturnValue({
      promise: 'pdf data',
    });
    (window as any).Response = jest.fn().mockReturnValue({
      arrayBuffer: () => Promise.resolve('array buffer data'),
    });
    PDFDocument.load = jest.fn().mockReturnValue({
      getPages: getPagesMock,
      removePage: removePageMock,
      save: saveMock,
    });
  });

  it('loadPDFForSigning', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(null);

    const result = await loadPDFForSigningInteractor(applicationContext, {
      docketNumber: '101-20',
      documentStorageId: 'abc',
    });

    expect(result).toEqual('pdf data');
  });

  it('should pass the wasm asset path to pdf.js when loading a document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(null);

    await loadPDFForSigningInteractor(applicationContext, {
      docketNumber: '101-20',
      documentStorageId: 'abc',
    });

    expect(mockGetDocument).toHaveBeenCalledWith(
      expect.objectContaining({ wasmUrl: 'wasm/' }),
    );
  });

  it('should remove the first page of the PDF if `removeCover` is set to true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(null);

    await loadPDFForSigningInteractor(applicationContext, {
      docketNumber: '101-20',
      documentStorageId: 'abc',
      removeCover: true,
    });

    expect(removePageMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
  });

  it('should remove all pages of the PDF except the coversheet if `onlyCover` is set to true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(testPdfDoc);

    await loadPDFForSigningInteractor(applicationContext, {
      docketNumber: '101-20',
      documentStorageId: 'abc',
      onlyCover: true,
    });

    expect(removePageMock).toHaveBeenCalledTimes(fakePdfPages.length - 1);
    expect(saveMock).toHaveBeenCalled();
  });

  it('should throw an error if getDocument returns an error', async () => {
    const mockDocumentStorageId = '123456687875456';
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockImplementation(() => {
        throw new Error('something');
      });

    await expect(
      loadPDFForSigningInteractor(applicationContext, {
        docketNumber: '101-20',
        documentStorageId: mockDocumentStorageId,
      }),
    ).rejects.toThrow(
      new Error(`error loading PDF for signing: ${mockDocumentStorageId}`),
    );
  });
});
