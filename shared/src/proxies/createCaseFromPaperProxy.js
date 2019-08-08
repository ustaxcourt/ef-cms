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
  requestForPlaceOfTrialFileId,
  stinFileId,
}) => {
  return post({
    applicationContext,
    body: {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      requestForPlaceOfTrialFileId,
      stinFileId,
    },
    endpoint: '/cases/paper',
  });
};
