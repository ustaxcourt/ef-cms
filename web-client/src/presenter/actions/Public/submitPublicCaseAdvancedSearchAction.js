import { state } from 'cerebral';

/**
 * submit public case advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitPublicCaseAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const form = get(state.advancedSearchForm.caseSearchByName);
  const searchResults = await applicationContext
    .getUseCases()
    .casePublicSearchInteractor(applicationContext, {
      searchParams: form,
    });

  return { searchResults };
};

/**
 * submit public case advanced search form while feeling lucky
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitPublicCaseAdvancedSearchWhileFeelingLuckyAction = async ({
  applicationContext,
  get,
}) => {
  const form = get(state.advancedSearchForm.caseSearchByName);
  const searchResults = await applicationContext
    .getUseCases()
    .casePublicSearchInteractor(applicationContext, {
      searchParams: form,
    });

  window.location.href = `/case-detail/${searchResults[0].docketNumber}`;
};
