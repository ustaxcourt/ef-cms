import { clearAdvancedSearchFormAction } from '../actions/clearAdvancedSearchFormAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';

export const clearAdvancedSearchFormSequence = [
  clearAdvancedSearchFormAction,
  setDefaultCountryTypeOnAdvancedSearchFormAction,
];
