import { state } from 'cerebral';

/**
 * sets the state.advancedSearchForm to page 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearCaseSearchByNameFormAction = ({ store }) => {
  store.set(state.advancedSearchForm.caseSearchByName, {
    countryType: 'domestic',
  });
  store.unset(state.searchResults);
  store.set(state.advancedSearchForm.currentPage, 1);
};
