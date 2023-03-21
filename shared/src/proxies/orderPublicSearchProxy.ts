const { get } = require('./requests');

/**
 * orderPublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params (keyword or phrase)
 * @returns {Promise<*>} the promise of the api call
 */
exports.orderPublicSearchInteractor = (
  applicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/order-search',
    params: searchParams,
  });
};
