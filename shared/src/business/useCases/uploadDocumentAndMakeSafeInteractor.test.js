const {
  uploadDocumentAndMakeSafeInteractor,
} = require('./uploadDocumentAndMakeSafeInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

describe('uploadDocumentAndMakeSafeInteractor', () => {
  const mockDocument = MOCK_DOCUMENTS;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient.mockResolvedValue(mockDocument.documentId);
  });
  it('returns the newly created document ID', async () => {
    const expectDocumentId = await uploadDocumentAndMakeSafeInteractor({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });
    expect(expectDocumentId).toEqual(mockDocument.documentId);
  });

  it('calls upload on the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual(mockDocument);
  });

  it('calls upload with the given documentId if set', async () => {
    await uploadDocumentAndMakeSafeInteractor({
      applicationContext,
      document: mockDocument,
      documentId: '123',
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].documentId,
    ).toEqual('123');
  });

  it('does a virus scan on the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor.mock.calls[0][0]
        .documentId,
    ).toEqual(mockDocument.documentId);
  });

  it('validates the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });
    expect(
      applicationContext.getUseCases().validatePdfInteractor.mock.calls[0][0]
        .documentId,
    ).toEqual(mockDocument.documentId);
  });
});
