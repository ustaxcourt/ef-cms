const { post } = require('./requests');

/**
 * createCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {object} providers.petitionMetadata the petition metadata
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCaseInteractor = (
  applicationContext,
  { ownershipDisclosureFileId, petitionFileId, petitionMetadata, stinFileId },
) => {
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
