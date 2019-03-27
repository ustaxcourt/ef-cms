const { post } = require('./requests');

/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCaseFromPaper = ({
  petitionMetadata,
  petitionFileId,
  ownershipDisclosureFileId,
  applicationContext,
  stinFileId,
}) => {
  return post({
    applicationContext,
    body: {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      stinFileId,
    },
    endpoint: '/cases/paper',
  });
};
