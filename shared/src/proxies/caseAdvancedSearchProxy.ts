import { get } from './requests';

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params (can include petitionerName, country, state, yearFiledMin, yearFiledMax)
 * @returns {Promise<*>} the promise of the api call
 */
export const caseAdvancedSearchInteractor = (
  applicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
