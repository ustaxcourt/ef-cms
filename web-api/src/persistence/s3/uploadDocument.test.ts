import { Upload } from '@aws-sdk/lib-storage';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { testPdfDoc } from '../../../../shared/src/business/test/getFakeFile';
import { uploadDocument } from './uploadDocument';

describe('uploadDocument', () => {
  const mockUploadDone = jest
    .spyOn(Upload.prototype, 'done')
    .mockResolvedValue({} as never);

  it('fails and logs if the s3 upload fails', async () => {
    mockUploadDone.mockRejectedValue(new Error('Upload failed'));

    await expect(
      uploadDocument({
        applicationContext,
        pdfData: testPdfDoc,
        pdfName: 'pdf name',
      }),
    ).rejects.toEqual(new Error('Upload failed'));
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Failed to upload document (pdf name) to S3.',
    );
  });

  it('should not log if the s3 upload completes', async () => {
    mockUploadDone.mockResolvedValue({ $metadata: {} });

    await uploadDocument({
      applicationContext,
      pdfData: testPdfDoc,
      pdfName: 'pdf name',
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});
