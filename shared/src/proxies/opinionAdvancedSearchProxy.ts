const { get } = require('./requests');
const { omit } = require('lodash');

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
  const opinionTypesQuery = searchParams.opinionTypes.join(',');

  return get({
    applicationContext,
    endpoint: '/case-documents/opinion-search',
    params: {
      ...omit(searchParams, 'opinionTypes'),
      opinionTypes: opinionTypesQuery,
    },
  });
};
