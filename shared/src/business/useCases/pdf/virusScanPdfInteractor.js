const fs = require('fs');
const tmp = require('tmp');

/**
 * virusScanPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the document to virus scan
 * @returns {object} errors (null if no errors)
 */
exports.virusScanPdfInteractor = async (applicationContext, { key }) => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  const inputPdf = tmp.fileSync();
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  try {
    await applicationContext.runVirusScan({ filePath: inputPdf.name });
    applicationContext.getStorageClient().putObjectTagging({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
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
        Key: key,
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
        Key: key,
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
