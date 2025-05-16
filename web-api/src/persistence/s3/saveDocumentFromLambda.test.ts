let mockPutObject = jest.fn();
const mockLogger = {
  addContext: jest.fn(),
  clearContext: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
jest.mock('@web-api/persistence/s3/getStorageClient', () => ({
  getStorageClient: () => {
    return { putObject: mockPutObject };
  },
}));
jest.mock('@web-api/utilities/logger/getLogger', () => {
  return {
    getLogger: () => mockLogger,
  };
});
import { environment } from '@web-api/environment';
import { saveDocumentFromLambda } from './saveDocumentFromLambda';

describe('saveDocumentFromLambda', () => {
  const expectedDocketEntryId = 'abc';
  const expectedArray = new Uint8Array([123]);
  const defaultBucketName = 'aBucket';
  const tempBucketName = 'aTempBucket';

  beforeEach(() => {
    environment.documentsBucketName = defaultBucketName;
    environment.tempDocumentsBucketName = tempBucketName;
  });

  it('saves the document', async () => {
    await saveDocumentFromLambda({
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(mockPutObject).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: defaultBucketName,
      ContentType: 'application/pdf',
      Key: expectedDocketEntryId,
    });
  });

  it('saves the document in the temp bucket', async () => {
    await saveDocumentFromLambda({
      document: expectedArray,
      key: expectedDocketEntryId,
      useTempBucket: true,
    });

    expect(mockPutObject).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: tempBucketName,
      ContentType: 'application/pdf',
      Key: expectedDocketEntryId,
    });
  });

  it('saves the document with a custom mime type (contentType)', async () => {
    await saveDocumentFromLambda({
      contentType: 'text/plain',
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(mockPutObject).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: defaultBucketName,
      ContentType: 'text/plain',
      Key: expectedDocketEntryId,
    });
  });

  it('should retry putObject call if it fails the first time', async () => {
    mockPutObject = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({});

    await saveDocumentFromLambda({
      contentType: 'text/plain',
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(mockPutObject).toHaveBeenCalledTimes(2);
  });

  it('should log and rethrow error if putObject fails every time', async () => {
    mockPutObject = jest.fn().mockImplementation(() => {
      throw new Error('fail');
    });

    await expect(
      saveDocumentFromLambda({
        contentType: 'text/plain',
        document: expectedArray,
        key: expectedDocketEntryId,
      }),
    ).rejects.toThrow('fail');

    expect(mockLogger.error).toHaveBeenCalled();
  });
});
