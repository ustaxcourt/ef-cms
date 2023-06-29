import { get } from './requests';

/**
 * casePublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params (can include petitionerName, country, state, yearFiledMin, yearFiledMax)
 * @returns {Promise<*>} the promise of the api call
 */
export const casePublicSearchInteractor = (
  applicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/search',
    params: searchParams,
  });
};
