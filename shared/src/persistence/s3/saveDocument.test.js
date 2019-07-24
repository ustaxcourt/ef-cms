const sinon = require('sinon');
const { saveDocument } = require('./saveDocument');

describe('saveDocument', () => {
  const putObjectStub = sinon.stub().returns({
    promise: async () => null,
  });

  it('deletes the document', async () => {
    let applicationContext = {
      environment: {
        documentsBucketName: 'aBucket',
      },
      getStorageClient: () => ({
        putObject: putObjectStub,
      }),
    };
    const expectedDocumentId = 'abc';
    const expectedArray = new Uint8Array(['a']);
    await saveDocument({
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
});
