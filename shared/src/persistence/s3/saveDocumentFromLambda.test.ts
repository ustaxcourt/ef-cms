const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { saveDocumentFromLambda } = require('./saveDocumentFromLambda');

describe('saveDocumentFromLambda', () => {
  let putObjectStub = jest.fn().mockReturnValue({
    promise: () => Promise.resolve(true),
  });

  const expectedDocketEntryId = 'abc';
  const expectedArray = new Uint8Array(['a']);
  const defaultBucketName = 'aBucket';

  beforeEach(() => {
    applicationContext.getDocumentsBucketName.mockReturnValue(
      defaultBucketName,
    );
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
    applicationContext.getTempDocumentsBucketName.mockReturnValue(
      'aTempBucket',
    );

    await saveDocumentFromLambda({
      applicationContext,
      document: expectedArray,
      key: expectedDocketEntryId,
      useTempBucket: true,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: 'aTempBucket',
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
      .mockReturnValueOnce(new Error('fail'))
      .mockReturnValueOnce({
        promise: () => Promise.resolve(true),
      });

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
