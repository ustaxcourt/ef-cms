import { state } from 'cerebral';

/**
 * clears the state.searchResults and sets the currentPage to 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSearchResultsAction = ({ store }) => {
  store.unset(state.searchResults);
  store.set(state.advancedSearchForm.currentPage, 1);
};
