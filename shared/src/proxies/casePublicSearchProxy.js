const querystring = require('querystring');
const { get } = require('./requests');

/**
 * casePublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params (can include petitionerName, country, state, yearFiledMin, yearFiledMax)
 * @returns {Promise<*>} the promise of the api call
 */
exports.casePublicSearchInteractor = (applicationContext, { searchParams }) => {
  const queryString = querystring.stringify(searchParams);

  return get({
    applicationContext,
    endpoint: `/public-api/search?${queryString}`,
  });
};
