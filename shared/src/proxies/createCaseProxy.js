const { post } = require('./requests');

/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = ({
  petitionMetadata,
  petitionFileId,
  ownershipDisclosureFileId,
  applicationContext,
}) => {
  return post({
    applicationContext,
    body: {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
    },
    endpoint: '/cases',
  });
};
