import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';

export const gotoAdvancedSearchSequence = [
  clearAlertsAction,
  clearScreenMetadataAction,
  clearFormAction,
  setDefaultCountryTypeOnAdvancedSearchFormAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
