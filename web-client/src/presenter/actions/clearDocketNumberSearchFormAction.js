import { state } from 'cerebral';

/**
 * sets the state.advancedSearchForm.docketNumberSearch to an empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearDocketNumberSearchFormAction = ({ store }) => {
  store.set(state.advancedSearchForm.caseSearchByDocketNumber, {});
  store.unset(state.searchResults);
  store.set(state.advancedSearchForm.currentPage, 1);
};
