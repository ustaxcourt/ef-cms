const { get } = require('../requests');

/**
 * fetchPendingItemsProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.fetchPendingItemsInteractor = ({ applicationContext, judge }) => {
  var queryString = '';

  if (judge) {
    queryString = '?judge=' + encodeURIComponent(judge);
  }

  return get({
    applicationContext,
    endpoint: `/api/pending-items${queryString}`,
  });
};
