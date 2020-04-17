const querystring = require('querystring');
const { get } = require('./requests');

/**
 * orderPublicSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.searchParams the search params (keyword or phrase)
 * @returns {Promise<*>} the promise of the api call
 */
exports.orderPublicSearchInteractor = ({
  applicationContext,
  searchParams,
}) => {
  const queryString = querystring.stringify(searchParams);

  return get({
    applicationContext,
    endpoint: `/public-api/order-search?${queryString}`,
  });
};
