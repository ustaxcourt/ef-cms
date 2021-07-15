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
  const mockVirusScanQueueUrl = 'mockQueueUrl';
  const mockDocumentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockReceiptHandle = '83ae0b62-0fb2-4092-96b6-695dfdf9cad5';

  beforeAll(() => {
    applicationContext.environment = {
      documentsBucketName: mockDocumentsBucketName,
      quarantineBucketName: mockQuarantineBucketName,
      virusScanQueueUrl: mockVirusScanQueueUrl,
    };

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testAsset('sample.pdf'),
      }),
    });
  });

  it('should call deleteMessage and not call putObject or deleteObject if Records is undefined', async () => {
    await virusScanPdfInteractor(applicationContext, {
      message: {
        Body: JSON.stringify({
          Records: undefined,
        }),
        ReceiptHandle: mockReceiptHandle,
      },
    });

    expect(
      applicationContext.getMessagingClient().deleteMessage.mock.calls[0][0],
    ).toMatchObject({
      QueueUrl: mockVirusScanQueueUrl,
      ReceiptHandle: mockReceiptHandle,
    });
    expect(
      applicationContext.getStorageClient().putObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getStorageClient().deleteObject,
    ).not.toHaveBeenCalled();
  });

  it('should copy file to documents bucket, delete from quarantine bucket, and delete message if file is clean', async () => {
    applicationContext.runVirusScan.mockReturnValue(true);

    await virusScanPdfInteractor(applicationContext, {
      message: {
        Body: JSON.stringify({
          Records: [{ s3: { object: { key: mockDocumentId } } }],
        }),
        ReceiptHandle: mockReceiptHandle,
      },
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
    expect(
      applicationContext.getMessagingClient().deleteMessage.mock.calls[0][0],
    ).toMatchObject({
      QueueUrl: mockVirusScanQueueUrl,
      ReceiptHandle: mockReceiptHandle,
    });
  });

  it('should NOT copy file to documents bucket, delete from quarantine bucket, or delete message if file is NOT clean', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 1;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      message: {
        Body: JSON.stringify({
          Records: [{ s3: { object: { key: mockDocumentId } } }],
        }),
        ReceiptHandle: mockReceiptHandle,
      },
    });

    expect(
      applicationContext.getStorageClient().putObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getStorageClient().deleteObject,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getMessagingClient().deleteMessage,
    ).not.toHaveBeenCalled();
  });

  it('should call applicationContext.logger.error with file infected message if file is not clean and error code is 1', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 1;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      message: {
        Body: JSON.stringify({
          Records: [{ s3: { object: { key: mockDocumentId } } }],
        }),
        ReceiptHandle: mockReceiptHandle,
      },
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'file was infected',
    );
  });

  it('should call applicationContext.logger.error with something happened message if file is not clean and error code is NOT 1', async () => {
    applicationContext.runVirusScan.mockImplementation(() => {
      const err = new Error('a virus!');
      err.code = 2;
      throw err;
    });

    await virusScanPdfInteractor(applicationContext, {
      message: {
        Body: JSON.stringify({
          Records: [{ s3: { object: { key: mockDocumentId } } }],
        }),
        ReceiptHandle: mockReceiptHandle,
      },
    });

    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'something else happened',
    );
  });
});
