import { state } from 'cerebral';

/**
 * submit advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const form = get(state.form);

  const searchResults = await applicationContext
    .getUseCases()
    .caseSearchInteractor({
      applicationContext,
      searchParams: form,
    });

  return { searchResults };
};
