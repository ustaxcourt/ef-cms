const fs = require('fs');
const path = require('path');
const { zipDocuments } = require('./zipDocuments');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testAsset = name => {
  return fs.readFileSync(testAssetsPath + name);
};

describe('zipDocuments', () => {
  const s3ClientMock = {
    getObject: () => {
      return {
        createReadStream: () => {
          return {
            on: () => null,
            pipe: () => null,
            promise: async () => ({
              Body: testAsset('sample.pdf'),
            }),
          };
        },
      };
    },
    upload: () => null,
  };
  const applicationContext = {
    environment: {
      documentsBucketName: 'documents',
      region: 'localhost-testing',
    },
    getStorageClient: () => s3ClientMock,
  };

  it('calls the s3 archive returning a promise', async () => {
    const zipProcess = zipDocuments({
      applicationContext,
      fileNames: ['Test File 1', 'Test File 2'],
      s3Ids: [123, 456],
      zipName: 'TestZip.zip',
    });

    expect(zipProcess instanceof Promise).toBeTruthy();
  });
});
