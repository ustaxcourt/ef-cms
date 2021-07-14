import { ROLES } from '../entities/EntityConstants';
import { User } from '../entities/User';
import {
  applicationContext,
  testPdfDoc,
} from '../test/createTestApplicationContext';
import { uploadToS3 } from './uploadToS3';

describe('uploadToS3', () => {
  let getObjectMock = () => {
    return {
      promise: async () => ({
        Body: testPdfDoc,
      }),
    };
  };

  it('fails and logs if the s3 upload fails', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    let mockCaseConfirmationPdfName = 'pdf name';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, callback) => callback('there was an error uploading'),
    });

    await expect(
      uploadToS3({
        applicationContext,
        mockCaseConfirmationPdfName,
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
});
