import { state } from '@web-client/presenter/app.cerebral';

export const setAdvancedSearchResultsAction = ({
  get,
  props,
  store,
}: ActionProps<{
  searchResults: { results: any[]; totalCount: number };
}>) => {
  const tabName = get(state.advancedSearchTab);
  store.set(state.searchResults[tabName], props.searchResults);
};
