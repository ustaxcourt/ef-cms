const querystring = require('querystring');
const { get } = require('./requests');

/**
 * opinionPublicSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.searchParams the search params (keyword)
 * @returns {Promise<*>} the promise of the api call
 */
exports.opinionPublicSearchInteractor = ({
  applicationContext,
  searchParams,
}) => {
  const queryString = querystring.stringify(searchParams);

  return get({
    applicationContext,
    endpoint: `/public-api/opinion-search?${queryString}`,
  });
};
