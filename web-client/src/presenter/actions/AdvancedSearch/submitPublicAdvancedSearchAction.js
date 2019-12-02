import { state } from 'cerebral';

/**
 * submit public search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitPublicAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const form = get(state.advancedSearchForm);

  const searchResults = await applicationContext
    .getUseCases()
    .casePublicSearchInteractor({
      applicationContext,
      searchParams: form,
    });

  return { searchResults };
};
