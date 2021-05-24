const { put } = require('../requests');

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the list of filers to associate with
 * @returns {Promise<*>} the promise of the api call
 */
exports.submitCaseAssociationRequestInteractor = (
  applicationContext,
  { docketNumber, filers },
) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    body: {
      filers,
    },
    endpoint: `/users/${user.userId}/case/${docketNumber}`,
  });
};
