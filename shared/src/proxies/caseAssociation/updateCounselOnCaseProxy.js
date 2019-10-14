const { put } = require('../requests');

/**
 * getCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCounselOnCaseInteractor = ({
  applicationContext,
  caseId,
  userData,
  userIdToUpdate,
}) => {
  return put({
    applicationContext,
    body: { ...userData },
    endpoint: `/cases/${caseId}/counsel/${userIdToUpdate}`,
  });
};
