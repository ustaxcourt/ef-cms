const { promises: fs } = require('fs');

const NodeClam = require('clamscan');
const ClamScan = new NodeClam().init();

/**
 * virusScanDocument
 * @param applicationContext
 * @param documentMetadata
 * @returns {Object} errors (null if no errors)
 */
exports.virusScanDocument = async ({
  applicationContext,
  documentId,
  user,
}) => {
  const documentObject = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId,
      protocol: 'S3',
    });
  const tempFileLocation = '/tmp/document.pdf';
  await fs.writeFile(tempFileLocation, documentObject);
  ClamScan.then(async clamscan => {
    const { is_infected, file, viruses } = await clamscan.is_infected(
      tempFileLocation,
    );
    console.log(is_infected, file, viruses, user);
    return true;
  });
};
