const fs = require('fs');
const tmp = require('tmp');
const util = require('util');
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

/**
 * virusScanDocument
 * @param applicationContext
 * @param documentId
 * @returns {Object} errors (null if no errors)
 */
exports.virusScanPdf = async ({ applicationContext, documentId }) => {
  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();

  const inputPdf = tmp.fileSync();
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  let results;
  try {
    const scanResults = await execPromise(`clamscan ${inputPdf.name}`);
    applicationContext.logger.time(scanResults);
    results = 'clean';
  } catch (e) {
    applicationContext.logger.time(e);
    if (e.code === 1) {
      results = 'infected';
    } else {
      results = 'error';
    }
  }

  return results;
};
