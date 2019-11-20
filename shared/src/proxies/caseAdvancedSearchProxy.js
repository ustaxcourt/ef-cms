const { get } = require('./requests');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.searchParams the search params (can include petitionerName, country, state, yearFiledMin, yearFiledMax)
 * @returns {Promise<*>} the promise of the api call
 */
exports.caseAdvancedSearchInteractor = ({
  applicationContext,
  searchParams,
}) => {
  var queryString = Object.keys(searchParams)
    .map(key => {
      return (
        encodeURIComponent(key) + '=' + encodeURIComponent(searchParams[key])
      );
    })
    .join('&');

  return get({
    applicationContext,
    endpoint: `/cases/search?${queryString}`,
  });
};
