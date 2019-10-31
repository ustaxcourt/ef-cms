import { set, unset } from 'cerebral/factories';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';
import { state } from 'cerebral';

export const clearAdvancedSearchFormSequence = [
  set(state.advancedSearchForm, { currentPage: 1 }),
  unset(state.searchResults),
  setDefaultCountryTypeOnAdvancedSearchFormAction,
];
