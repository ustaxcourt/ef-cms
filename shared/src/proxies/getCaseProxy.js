const { get } = require('./requests');

/**
 * getCaseInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getCaseInteractor = ({ applicationContext, docketNumber }) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
