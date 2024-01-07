import { CasePublicSearchResultsType } from '@web-api/persistence/elasticsearch/casePublicSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const setAdvancedSearchResultsAction = ({
  get,
  props,
  store,
}: ActionProps<{
  searchResults: CasePublicSearchResultsType;
}>) => {
  const tabName = get(state.advancedSearchTab);
  store.set(state.searchResults[tabName], props.searchResults);
};
