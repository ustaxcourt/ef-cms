import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { saveDocumentFromLambda } from './saveDocumentFromLambda';

describe('saveDocumentFromLambda', () => {
  let putObjectStub = jest.fn();

  const expectedDocketEntryId = 'abc';
  const expectedArray = new Uint8Array([123]);
  const defaultBucketName = 'aBucket';
  const tempBucketName = 'aTempBucket';

  beforeEach(() => {
    applicationContext.environment.documentsBucketName = defaultBucketName;
    applicationContext.environment.tempDocumentsBucketName = tempBucketName;
  });

  it('saves the document', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });

    await saveDocumentFromLambda({
      applicationContext,
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: defaultBucketName,
      ContentType: 'application/pdf',
      Key: expectedDocketEntryId,
    });
  });

  it('saves the document in the temp bucket', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });

    await saveDocumentFromLambda({
      applicationContext,
      document: expectedArray,
      key: expectedDocketEntryId,
      useTempBucket: true,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: tempBucketName,
      ContentType: 'application/pdf',
      Key: expectedDocketEntryId,
    });
  });

  it('saves the document with a custom mime type (contentType)', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });

    await saveDocumentFromLambda({
      applicationContext,
      contentType: 'text/plain',
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: defaultBucketName,
      ContentType: 'text/plain',
      Key: expectedDocketEntryId,
    });
  });

  it('should retry putObject call if it fails the first time', async () => {
    putObjectStub = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({});

    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });

    await saveDocumentFromLambda({
      applicationContext,
      contentType: 'text/plain',
      document: expectedArray,
      key: expectedDocketEntryId,
    });

    expect(putObjectStub).toHaveBeenCalledTimes(2);
  });

  it('should log and rethrow error if putObject fails every time', async () => {
    putObjectStub = jest.fn().mockImplementation(() => {
      throw new Error('fail');
    });

    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });

    await expect(
      saveDocumentFromLambda({
        applicationContext,
        contentType: 'text/plain',
        document: expectedArray,
        key: expectedDocketEntryId,
      }),
    ).rejects.toThrow('fail');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
