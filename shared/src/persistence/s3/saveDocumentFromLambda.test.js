const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { saveDocumentFromLambda } = require('./saveDocumentFromLambda');

describe('saveDocumentFromLambda', () => {
  const putObjectStub = jest.fn().mockReturnValue({
    promise: () => Promise.resolve(true),
  });

  it('saves the document', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });
    applicationContext.getDocumentsBucketName.mockReturnValue('aBucket');
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);

    await saveDocumentFromLambda({
      applicationContext,
      document: new Uint8Array(['a']),
      documentId: expectedDocumentId,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: 'aBucket',
      ContentType: 'application/pdf',
      Key: expectedDocumentId,
    });
  });

  it('saves the document in the temp bucket', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });
    applicationContext.getTempDocumentsBucketName.mockReturnValue(
      'aTempBucket',
    );
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);

    await saveDocumentFromLambda({
      applicationContext,
      document: new Uint8Array(['a']),
      documentId: expectedDocumentId,
      useTempBucket: true,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: 'aTempBucket',
      ContentType: 'application/pdf',
      Key: expectedDocumentId,
    });
  });

  it('saves the document with a custom mime type (contentType)', async () => {
    applicationContext.getStorageClient = () => ({
      putObject: putObjectStub,
    });
    applicationContext.getDocumentsBucketName.mockReturnValue('aBucket');
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);

    await saveDocumentFromLambda({
      applicationContext,
      contentType: 'text/plain',
      document: new Uint8Array(['a']),
      documentId: expectedDocumentId,
    });

    expect(putObjectStub).toHaveBeenCalledWith({
      Body: Buffer.from(expectedArray),
      Bucket: 'aBucket',
      ContentType: 'text/plain',
      Key: expectedDocumentId,
    });
  });
});
