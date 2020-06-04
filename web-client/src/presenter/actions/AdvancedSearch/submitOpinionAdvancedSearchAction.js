import { state } from 'cerebral';

/**
 * submit advanced search form to search for opinions
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const searchParams = get(state.advancedSearchForm.opinionSearch);

  const searchResults = await applicationContext
    .getUseCases()
    .opinionAdvancedSearchInteractor({
      applicationContext,
      searchParams,
    });

  return { searchResults };
};
