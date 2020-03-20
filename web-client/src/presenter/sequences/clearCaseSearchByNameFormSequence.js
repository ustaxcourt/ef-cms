import { clearCaseSearchByNameFormAction } from '../actions/clearCaseSearchByNameFormAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';

export const clearCaseSearchByNameFormSequence = [
  clearCaseSearchByNameFormAction,
  setDefaultCountryTypeOnAdvancedSearchFormAction,
];
