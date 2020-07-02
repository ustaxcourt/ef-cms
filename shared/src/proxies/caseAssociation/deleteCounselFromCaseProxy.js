const { remove } = require('../requests');

/**
 * deleteCounselFromCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCounselFromCaseInteractor = ({
  applicationContext,
  caseId,
  userIdToDelete,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-parties/${caseId}/counsel/${userIdToDelete}`,
  });
};
