const { head } = require('./requests');

/**
 * getCaseExistsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the id of the case to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseExistsInteractor = (applicationContext, { docketNumber }) => {
  return head({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
