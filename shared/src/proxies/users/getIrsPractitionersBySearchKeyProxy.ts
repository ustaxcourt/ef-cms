import { get } from '../requests';

/**
 * getIrsPractitionersBySearchKeyProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.searchKey the search string entered by the user
 * @returns {Promise<*>} the promise of the api call
 */
export const getIrsPractitionersBySearchKeyInteractor = (
  applicationContext,
  { searchKey },
) => {
  return get({
    applicationContext,
    endpoint: `/users/irsPractitioners/search?searchKey=${searchKey}`,
  });
};
