const { get } = require('./requests');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params
 * @returns {Promise<*>} the promise of the api call
 */
exports.orderAdvancedSearchInteractor = (
  applicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/case-documents/order-search',
    params: searchParams,
  });
};
