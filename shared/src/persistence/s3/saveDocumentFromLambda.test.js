const sinon = require('sinon');
const { saveDocumentFromLambda } = require('./saveDocumentFromLambda');

describe('saveDocumentFromLambda', () => {
  const putObjectStub = sinon.stub().returns({
    promise: async () => null,
  });

  it('saves the document', async () => {
    let applicationContext = {
      getDocumentsBucketName: () => {
        return 'aBucket';
      },
      getStorageClient: () => ({
        putObject: putObjectStub,
      }),
      getTempDocumentsBucketName: () => {
        return 'aTempBucket';
      },
    };
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);
    await saveDocumentFromLambda({
      applicationContext,
      document: new Uint8Array(['a']),
      documentId: expectedDocumentId,
    });
    expect(putObjectStub.getCall(0).args[0]).toMatchObject({
      Body: Buffer.from(expectedArray),
      Bucket: 'aBucket',
      ContentType: 'application/pdf',
      Key: expectedDocumentId,
    });
  });

  it('saves the document in the temp bucket', async () => {
    let applicationContext = {
      getDocumentsBucketName: () => {
        return 'aBucket';
      },
      getStorageClient: () => ({
        putObject: putObjectStub,
      }),
      getTempDocumentsBucketName: () => {
        return 'aTempBucket';
      },
    };
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);
    await saveDocumentFromLambda({
      applicationContext,
      document: new Uint8Array(['a']),
      documentId: expectedDocumentId,
      useTempBucket: true,
    });
    expect(putObjectStub.getCall(1).args[0]).toMatchObject({
      Body: Buffer.from(expectedArray),
      Bucket: 'aTempBucket',
      ContentType: 'application/pdf',
      Key: expectedDocumentId,
    });
  });
});
