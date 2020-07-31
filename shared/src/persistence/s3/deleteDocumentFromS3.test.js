const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { deleteDocumentFromS3 } = require('./deleteDocumentFromS3');

describe('deleteDocumentFromS3', () => {
  beforeAll(() => {
    applicationContext.environment.documentsBucketName = 'aBucket';
    applicationContext.getStorageClient().deleteObject.mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    });
  });

  it('deletes the document', async () => {
    await deleteDocumentFromS3({
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
