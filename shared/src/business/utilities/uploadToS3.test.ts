import { applicationContext } from '../test/createTestApplicationContext';
import { testPdfDoc } from '../test/getFakeFile';
import { uploadToS3 } from './uploadToS3';

describe('uploadToS3', () => {
  let getObjectMock = () => {
    return {
      promise: () =>
        Promise.resolve({
          Body: testPdfDoc,
        }),
    };
  };

  it('fails and logs if the s3 upload fails', async () => {
    let mockPdfName = 'pdf name';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, callback) => callback('there was an error uploading'),
    });

    await expect(
      uploadToS3({
        applicationContext,
        pdfName: mockPdfName,
        testPdfDoc,
      }),
    ).rejects.toEqual('there was an error uploading');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'An error occurred while attempting to upload to S3',
    );
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual({
      err: 'there was an error uploading',
    });
  });

  it('should not log if the s3 upload completes', async () => {
    let mockPdfName = 'pdf name';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, callback) => callback(),
    });

    await uploadToS3({
      applicationContext,
      pdfName: mockPdfName,
      testPdfDoc,
    });
    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});
