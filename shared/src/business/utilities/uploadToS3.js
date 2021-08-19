/**
 *
 * @param {object} applicationContext the applicationContext
 * @param {string} caseConfirmationPdfName the case confirmation pdf name
 * @param {string} pdfData the pdfData
 */

const uploadToS3 = async ({
  applicationContext,
  caseConfirmationPdfName,
  pdfData,
}) => {
  await new Promise((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdfData,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: caseConfirmationPdfName,
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
};

module.exports = {
  uploadToS3,
};
