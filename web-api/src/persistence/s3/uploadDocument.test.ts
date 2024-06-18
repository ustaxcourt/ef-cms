import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { testPdfDoc } from '../../../../shared/src/business/test/getFakeFile';
import { uploadDocument } from './uploadDocument';

describe('uploadDocument', () => {
  let getObjectMock = () => {
    return {
      promise: () =>
        Promise.resolve({
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

    let mockPdfName = 'pdf name';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, callback) => callback('there was an error uploading'),
    });

    await expect(
      uploadDocument({
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
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    let mockPdfName = 'pdf name';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, callback) => callback(),
    });

    await uploadDocument({
      applicationContext,
      pdfName: mockPdfName,
      testPdfDoc,
    });
    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});
