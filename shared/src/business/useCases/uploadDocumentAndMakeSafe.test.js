const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { uploadDocumentAndMakeSafe } = require('./uploadDocumentAndMakeSafe');

describe('uploadDocumentAndMakeSafe', () => {
  const mockDocument = MOCK_DOCUMENTS;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient.mockResolvedValue(mockDocument.documentId);
  });
  it('returns the newly created document ID', async () => {
    const expectDocumentId = await uploadDocumentAndMakeSafe({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });
    expect(expectDocumentId).toEqual(mockDocument.documentId);
  });

  it('calls upload on a the provided document', async () => {
    await uploadDocumentAndMakeSafe({
      applicationContext,
      document: mockDocument,
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual(mockDocument);
  });

  it('does a virus scan on the provided document', async () => {
    await uploadDocumentAndMakeSafe({
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
    await uploadDocumentAndMakeSafe({
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
