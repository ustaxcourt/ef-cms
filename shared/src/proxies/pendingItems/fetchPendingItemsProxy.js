const qs = require('qs');
const { get } = require('../requests');

/**
 * fetchPendingItemsProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.fetchPendingItemsInteractor = (
  applicationContext,
  { judge, page = 0 },
) => {
  const queryString = qs.stringify({ judge, page });

  return get({
    applicationContext,
    endpoint: `/reports/pending-items?${queryString}`,
  });
};
