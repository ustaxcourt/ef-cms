import { state } from 'cerebral';

/**
 * submit public opinion advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitPublicOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const form = get(state.advancedSearchForm.opinionSearch);

  const searchResults = await applicationContext
    .getUseCases()
    .opinionPublicSearchInteractor({
      applicationContext,
      searchParams: form,
    });

  return { searchResults };
};
