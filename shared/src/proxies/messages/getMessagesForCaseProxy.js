const { get } = require('../requests');

/**
 * getMessagesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.getMessagesForCaseInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${docketNumber}`,
  });
};
