/**
 *
 * @param {object} applicationContext the applicationContext
 * @param {string} pdfName the pdf name
 * @param {string} pdfData the pdfData
 */

export const uploadToS3 = ({ applicationContext, pdfData, pdfName }) =>
  new Promise((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdfData,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: pdfName,
    };

    s3Client.upload(params, function (err) {
      if (err) {
        applicationContext.logger.error(
          'An error occurred while attempting to upload to S3',
          { err },
        );
        reject(err);
      }

      resolve();
    });
  });
