const { deleteDocument } = require('./deleteDocument');
const sinon = require('sinon');

describe('deleteDocument', () => {
  const deleteObjectStub = sinon.stub().returns({
    promise: () => {
      return Promise.resolve();
    },
  });

  it('deletes the document', async () => {
    let applicationContext = {
      environment: {
        documentsBucketName: 'aBucket',
      },
      getStorageClient: () => ({
        deleteObject: deleteObjectStub,
      }),
    };
    await deleteDocument({
      applicationContext,
      key: 'deleteThisDocument',
    });
    expect(deleteObjectStub.getCall(0).args[0]).toMatchObject({
      Bucket: 'aBucket',
      Key: 'deleteThisDocument',
    });
  });
});
