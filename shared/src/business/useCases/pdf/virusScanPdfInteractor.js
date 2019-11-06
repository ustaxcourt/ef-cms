const fs = require('fs');
const tmp = require('tmp');

/**
 * virusScanPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the id of the document to virus scan
 * @returns {object} errors (null if no errors)
 */
exports.virusScanPdfInteractor = async ({ applicationContext, documentId }) => {
  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  applicationContext.logger.timeEnd('Fetching S3 File');

  const inputPdf = tmp.fileSync();
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  try {
    applicationContext.logger.time('Running Clamscan');
    await applicationContext.runVirusScan({ filePath: inputPdf.name });
    applicationContext.logger.timeEnd('Running Clamscan');
    applicationContext.getStorageClient().putObjectTagging({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
      Tagging: {
        TagSet: [
          {
            Key: 'virus-scan',
            Value: 'clean',
          },
        ],
      },
    });
    return 'clean';
  } catch (e) {
    applicationContext.logger.error(e);
    if (e.code === 1) {
      applicationContext.getStorageClient().putObjectTagging({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: documentId,
        Tagging: {
          TagSet: [
            {
              Key: 'virus-scan',
              Value: 'infected',
            },
          ],
        },
      });
      throw new Error('infected');
    } else {
      applicationContext.getStorageClient().putObjectTagging({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: documentId,
        Tagging: {
          TagSet: [
            {
              Key: 'virus-scan',
              Value: 'error',
            },
          ],
        },
      });
      throw new Error('error scanning PDF');
    }
  }
};
