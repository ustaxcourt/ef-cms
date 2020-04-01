const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { deleteDocument } = require('./deleteDocument');

describe('deleteDocument', () => {
  beforeAll(() => {
    applicationContext.environment.documentsBucketName = 'aBucket';
    applicationContext.getStorageClient().deleteObject.mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    });
  });

  it('deletes the document', async () => {
    await deleteDocument({
      applicationContext,
      key: 'deleteThisDocument',
    });

    expect(
      applicationContext.getStorageClient().deleteObject.mock.calls[0][0],
    ).toMatchObject({
      Bucket: 'aBucket',
      Key: 'deleteThisDocument',
    });
  });
});
