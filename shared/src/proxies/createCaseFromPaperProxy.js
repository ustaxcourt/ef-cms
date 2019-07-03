const { post } = require('./requests');

/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCaseFromPaperInteractor = ({
  applicationContext,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
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
