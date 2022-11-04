const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { deleteDocumentFile } = require('./deleteDocumentFile');

describe('deleteDocumentFile', () => {
  beforeAll(() => {
    applicationContext.environment.documentsBucketName = 'aBucket';
    applicationContext.getStorageClient().deleteObject.mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    });
  });

  it('deletes the document', async () => {
    await deleteDocumentFile({
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
