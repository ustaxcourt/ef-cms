const { put } = require('../requests');

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.representingPrimary true if the user is representing
 * the primary contact on the case, false otherwise
 * @param {string} providers.representingSecondary true if the user is representing
 * the secondary contact on the case, false otherwise
 * @returns {Promise<*>} the promise of the api call
 */
exports.submitCaseAssociationRequestInteractor = ({
  applicationContext,
  docketNumber,
  representingPrimary,
  representingSecondary,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    body: {
      representingPrimary,
      representingSecondary,
    },
    endpoint: `/users/${user.userId}/case/${docketNumber}`,
  });
};
