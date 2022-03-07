const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { savePaperServicePdf } = require('./savePaperServicePdf');

const mockDocumentId = 'cf332ba3-df9e-42c6-b9bc-065da5bb7a36';
const mockDocumentUrl = 'www.example.com';
const mockDocument = {
  getPages: jest.fn(),
  save: jest.fn(),
};

describe('savePaperServicePdf', () => {
  beforeEach(() => {
    applicationContext.getUniqueId.mockReturnValue(mockDocumentId);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: mockDocumentUrl });

    mockDocument.getPages.mockReturnValue({ length: 1 });
    mockDocument.save.mockReturnValue(mockDocument);
  });

  it('should not return a url or docketEntryId when there is no paper service on the case', async () => {
    mockDocument.getPages.mockReturnValue({ length: undefined });

    const serviceInfo = await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(serviceInfo).toEqual({
      docketEntryId: null,
      hasPaper: false,
      url: null,
    });
  });

  it('should return a url and docketEntryId, and hasPaper true when there is paper service on the case', async () => {
    mockDocument.getPages.mockReturnValue({ length: 1 });

    const serviceInfo = await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(serviceInfo).toEqual({
      docketEntryId: mockDocumentId,
      hasPaper: true,
      url: mockDocumentUrl,
    });
  });

  it('should save the pdf to s3 when there is paper service on the case', async () => {
    await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockDocument,
      key: mockDocumentId,
      useTempBucket: true,
    });
  });

  it('should not save the pdf to s3 when there is no paper service on the case', async () => {
    mockDocument.getPages.mockReturnValue({ length: undefined });

    await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it('should get the pdf url when there is paper service on the case', async () => {
    await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
  });

  it('should not get the pdf url when there is no paper service on the case', async () => {
    mockDocument.getPages.mockReturnValue({ length: undefined });

    await savePaperServicePdf({
      applicationContext,
      document: mockDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).not.toHaveBeenCalled();
  });
});
