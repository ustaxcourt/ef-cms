/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { zipDocuments } = require('./zipDocuments');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');

describe('zipDocuments', () => {
  const testAsset = name => {
    return fs.readFileSync(testAssetsPath + name);
  };

  beforeAll(() => {
    const s3ClientMock = {
      upload: (params, cb) => {
        return cb(true);
      },
    };
    applicationContext.getStorageClient.mockReturnValue(s3ClientMock);
  });

  it('calls the s3 archive returning a promise', async () => {
    const zipProcess = zipDocuments({
      applicationContext,
      extraFileNames: ['Test File Non - S3'],
      extraFiles: [testAsset('sample.pdf')],
      fileNames: ['Test File 1', 'Test File 2'],
      returnBuffer: true,
      s3Ids: [123, 456],
      zipName: 'TestZip.zip',
    });

    expect(zipProcess instanceof Promise).toBeTruthy();
  });
});
