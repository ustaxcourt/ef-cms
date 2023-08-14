import { MOCK_DOCUMENTS } from '../../test/mockDocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';
import { uploadDocumentAndMakeSafeInteractor } from './uploadDocumentAndMakeSafeInteractor';

describe('uploadDocumentAndMakeSafeInteractor', () => {
  const mockDocument = MOCK_DOCUMENTS;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient.mockResolvedValue(mockDocument.docketEntryId);
  });

  it('returns the newly created docket entry ID', async () => {
    const expectDocketEntryId = await uploadDocumentAndMakeSafeInteractor(
      applicationContext,
      {
        document: mockDocument,
        key: 'abc',
        onUploadProgress: () => {},
      },
    );

    expect(expectDocketEntryId).toEqual(mockDocument.docketEntryId);
  });

  it('calls upload on the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: mockDocument,
      key: 'abc',
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual(mockDocument);
  });

  it('calls upload with the given key if set', async () => {
    await uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: mockDocument,
      key: '123',
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].key,
    ).toEqual('123');
  });

  it('does a virus scan on the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: mockDocument,
      key: 'abc',
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor.mock
        .calls[0][0].key,
    ).toEqual(mockDocument.key);
  });

  it('validates the provided document', async () => {
    await uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: mockDocument,
      key: 'abc',
      onUploadProgress: () => {},
    });

    expect(
      applicationContext.getUseCases().validatePdfInteractor.mock.calls[0][0]
        .key,
    ).toEqual(mockDocument.key);
  });
});
