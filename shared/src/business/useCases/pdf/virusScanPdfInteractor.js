const fs = require('fs');
const NodeClam = require('clamscan');

/**
 * virusScanDocument
 * @param applicationContext
 * @param documentId
 * @param user
 * @returns {Object} errors (null if no errors)
 */
exports.virusScanPdf = async ({ applicationContext, documentId }) => {
  // TODO: move to applicationContext
  const clamscanConfig = {
    clamscan: {
      active: true, // Path to clamscan binary on your server
      db: null, // Path to a custom virus definition database
      path: '/usr/local/bin/clamscan', // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
      scan_archives: true, // If true, this module will consider using the clamscan binary
    },
  };
  const clamscan = await new NodeClam().init(clamscanConfig);

  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  const tempFileLocation = '/tmp/document.pdf';
  await fs.writeFile(tempFileLocation, pdfData);
  const results = await clamscan.is_infected(tempFileLocation);

  return { viruses: results.viruses };
};
