const { get } = require('../requests');

/**
 * getCaseMessagesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseMessagesForCaseInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
