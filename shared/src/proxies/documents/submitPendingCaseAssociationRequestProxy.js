const { put } = require('../requests');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.submitPendingCaseAssociationRequestInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${docketNumber}/pending`,
  });
};
