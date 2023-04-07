/**
 *
 * @param {object} applicationContext the applicationContext
 * @param {string} pdfName the pdf name
 * @param {string} pdfData the pdfData
 */

const uploadToS3 = ({ applicationContext, pdfData, pdfName }) =>
  new Promise((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdfData,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: pdfName,
    };

    return s3Client
      .putObject(params)
      .promise()
      .then(resolve)
      .catch(err => {
        applicationContext.logger.error(
          'An error occurred while attempting to upload to S3',
          { err },
        );
        reject(err);
      });
  });

module.exports = {
  uploadToS3,
};
