/**
 * @jest-environment node
 */
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { zipDocuments } from './zipDocuments';
import fs from 'fs';
import path from 'path';

describe('zipDocuments', () => {
  const samplePdfPath = path.join(
    __dirname,
    '../../../../shared/test-assets/sample.pdf',
  );
  const samplePdf = fs.readFileSync(samplePdfPath);

  beforeAll(() => {
    const s3ClientMock = {
      upload: (params, cb) => {
        return cb(true);
      },
    };
    applicationContext.getStorageClient.mockReturnValue(s3ClientMock);
  });

  it('calls the s3 archive returning a promise', () => {
    const zipProcess = zipDocuments({
      applicationContext,
      extraFileNames: ['Test File Non - S3'],
      extraFiles: [samplePdf],
      fileNames: ['Test File 1', 'Test File 2'],
      s3Ids: ['123', '456'],
      zipName: 'TestZip.zip',
    } as any);

    expect(zipProcess instanceof Promise).toBeTruthy();
  });
});
