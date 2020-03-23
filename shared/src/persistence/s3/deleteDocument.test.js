const { deleteDocument } = require('./deleteDocument');

describe('deleteDocument', () => {
  const deleteObjectStub = jest.fn().mockReturnValue({
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
    expect(deleteObjectStub.mock.calls[0][0]).toMatchObject({
      Bucket: 'aBucket',
      Key: 'deleteThisDocument',
    });
  });
});
