const { get } = require('./requests');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.searchParams the search params
 * @returns {Promise<*>} the promise of the api call
 */
exports.orderAdvancedSearchInteractor = ({
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
  console.log('???????????', queryString);

  return get({
    applicationContext,
    endpoint: `/case-documents/order-search?${queryString}`,
  });
};
