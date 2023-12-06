import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the state.searchResults and sets the currentPage to 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSearchResultsAction = ({ store }: ActionProps) => {
  store.unset(state.searchResults);
  store.set(state.advancedSearchForm.currentPage, 1);
};
