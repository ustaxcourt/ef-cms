const { get } = require('../requests');

/**
 * getPrivatePractitionersBySearchKeyProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.searchKey the search string entered by the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPrivatePractitionersBySearchKeyInteractor = (
  applicationContext,
  { searchKey },
) => {
  return get({
    applicationContext,
    endpoint: `/users/privatePractitioners/search?searchKey=${searchKey}`,
  });
};
