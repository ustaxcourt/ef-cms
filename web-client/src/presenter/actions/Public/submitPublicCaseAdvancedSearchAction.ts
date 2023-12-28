import { CasePublicSearchResultsType } from '@web-api/persistence/elasticsearch/casePublicSearch';
import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { prepareFormDataForCaseSearchApi } from '@web-client/presenter/actions/AdvancedSearch/submitCaseAdvancedSearchAction';
import { state } from '@web-client/presenter/app-public.cerebral';

export const submitPublicCaseAdvancedSearchAction = async ({
  applicationContext,
  get,
}: ActionProps<{}, ClientPublicApplicationContext>): Promise<{
  searchResults: CasePublicSearchResultsType;
}> => {
  const form = get(state.advancedSearchForm.caseSearchByName);

  const { results } = await applicationContext
    .getUseCases()
    .casePublicSearchInteractor(applicationContext, {
      searchParams: prepareFormDataForCaseSearchApi(form),
    });

  return { searchResults: results };
};
