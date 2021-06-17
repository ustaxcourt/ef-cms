const querystring = require('querystring');
const { get } = require('./requests');

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params
 * @returns {Promise<*>} the promise of the api call
 */
exports.opinionAdvancedSearchInteractor = (
  applicationContext,
  { searchParams },
) => {
  const queryString = querystring.stringify(searchParams);

  return get({
    applicationContext,
    endpoint: `/case-documents/opinion-search?${queryString}`,
  });
};
