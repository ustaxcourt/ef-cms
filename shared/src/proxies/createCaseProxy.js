const { post } = require('./requests');

/**
 * createCaseInteractor
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCaseInteractor = ({
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
    endpoint: '/cases',
  });
};
