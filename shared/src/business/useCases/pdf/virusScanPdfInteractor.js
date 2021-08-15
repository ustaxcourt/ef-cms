const fs = require('fs');
const tmp = require('tmp');

/**
 * virusScanPdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.key the S3 document ID
 * @param {object} providers.scanCompleteCallback to execute after scanning completes
 * @returns {Promise} resolves when complete
 */
exports.virusScanPdfInteractor = async (
  applicationContext,
  { key, scanCompleteCallback },
) => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.quarantineBucketName,
      Key: key,
    })
    .promise();

  const inputPdf = tmp.fileSync({
    mode: 0o644,
    tmpdir: process.env.TMP_PATH,
  });
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  try {
    await applicationContext.runVirusScan({ filePath: inputPdf.name });

    await applicationContext
      .getStorageClient()
      .putObject({
        Body: pdfData,
        Bucket: applicationContext.environment.documentsBucketName,
        ContentType: 'application/pdf',
        Key: key,
      })
      .promise();

    await applicationContext
      .getStorageClient()
      .deleteObject({
        Bucket: applicationContext.environment.quarantineBucketName,
        Key: key,
      })
      .promise();

    await scanCompleteCallback();
  } catch (e) {
    if (e.code === 1) {
      await scanCompleteCallback();
      applicationContext.logger.info('File was infected', e);
    } else {
      applicationContext.logger.error('Failed to scan', e);
    }
  }
};
