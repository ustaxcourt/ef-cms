import { state } from 'cerebral';

/**
 * sets the state.advancedSearchForm to page 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearCaseSearchByNameFormAction = ({ store }) => {
  store.unset(state.advancedSearchForm.petitionerName);
  store.unset(state.advancedSearchForm.yearFiledMin);
  store.unset(state.advancedSearchForm.yearFiledMax);
  store.unset(state.advancedSearchForm.petitionerState);
  store.set(state.advancedSearchForm.countryType, 'domestic');
  store.unset(state.searchResults);
  store.set(state.advancedSearchForm.currentPage, 1);
};
