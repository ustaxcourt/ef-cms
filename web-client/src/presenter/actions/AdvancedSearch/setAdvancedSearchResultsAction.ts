import { CaseSearchResult } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setAdvancedSearchResultsAction = ({
  get,
  props,
  store,
}: ActionProps<{
  searchResults: CaseSearchResult[];
}>) => {
  const tabName = get(state.advancedSearchTab);
  store.set(state.searchResults[tabName], props.searchResults);
};
