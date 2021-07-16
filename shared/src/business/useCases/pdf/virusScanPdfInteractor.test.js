const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { virusScanPdfInteractor } = require('./virusScanPdfInteractor');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testAsset = filename => {
  return fs.readFileSync(testAssetsPath + filename);
};

describe('virusScanPdfInteractor', () => {
  const mockDocumentsBucketName = 'mockDocuments';
  const mockQuarantineBucketName = 'mockDocuments';
  const mockDocumentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const scanCallbackMock = jest.fn();

  beforeAll(() => {
    applicationContext.environment = {
      documentsBucketName: mockDocumentsBucketName,
      quarantineBucketName: mockQuarantineBucketName,
    };

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Body: testAsset('sample.pdf'),
        }),
    });
  });

  it('should copy file to documents bucket, delete from quarantine bucket, and invoke callback if file is clean', async () => {
    applicationContext.runVirusScan.mockReturnValue(true);

    await virusScanPdfInteractor(applicationContext, {
      key: mockDocumentId,
      scanCompleteCallback: scanCallbackMock,
    });

    expect(
      applicationContext.getStorageClient().putObject.mock.calls[0][0],
    ).toMatchObject({
      Bucket: mockDocumentsBucketName,
      Key: mockDocumentId,
    });
    expect(
      applicationContext.getStorageClient().deleteObject.mock.calls[0][0],
    ).toMatchObject({
      Bucket: mockQuarantineBucketName,
      Key: mockDocumentId,
    });
    expect(scanCallbackMock).toHaveBeenCalled();
  });

  it('should NOT copy file to documents bucket, NOT delete from quarantine bucket, but successfully invoke callback if file is NOT clean', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 1;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      key: mockDocumentId,
      scanCompleteCallback: scanCallbackMock,
    });

    expect(
      applicationContext.getStorageClient().putObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getStorageClient().deleteObject,
    ).not.toHaveBeenCalled();
    expect(scanCallbackMock).toHaveBeenCalled();
  });

  it('should call applicationContext.logger.info with file infected message AND invoke scanCompleteCallback if file is not clean and error code is 1', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 1;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      key: mockDocumentId,
      scanCompleteCallback: scanCallbackMock,
    });

    expect(applicationContext.logger.info.mock.calls[0][0]).toEqual(
      'File was infected',
    );
    expect(scanCallbackMock).toHaveBeenCalled();
  });

  it('should call applicationContext.logger.error with something happened message and NOT invoke scanCompleteCallback if file is not clean and error code is NOT 1', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 2;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      key: mockDocumentId,
      scanCompleteCallback: scanCallbackMock,
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Failed to scan',
    );
    expect(scanCallbackMock).not.toHaveBeenCalled();
  });
});
