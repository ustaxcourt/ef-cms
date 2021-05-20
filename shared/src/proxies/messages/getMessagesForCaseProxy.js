const { get } = require('../requests');

/**
 * getMessagesForCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.getMessagesForCaseInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
