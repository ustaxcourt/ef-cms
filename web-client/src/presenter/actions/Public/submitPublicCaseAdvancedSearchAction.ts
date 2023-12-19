import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { prepareFormDataForCaseSearchApi } from '@web-client/presenter/actions/AdvancedSearch/submitCaseAdvancedSearchAction';
import { state } from '@web-client/presenter/app-public.cerebral';

/**
 * submit public case advanced search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitPublicCaseAdvancedSearchAction = async ({
  applicationContext,
  get,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const form = get(state.advancedSearchForm.caseSearchByName);

  const searchResults = await applicationContext
    .getUseCases()
    .casePublicSearchInteractor(applicationContext, {
      searchParams: prepareFormDataForCaseSearchApi(form),
    });

  return { searchResults };
};
