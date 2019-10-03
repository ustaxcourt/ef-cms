import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { set } from 'cerebral/factories';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';
import { state } from 'cerebral';

export const gotoAdvancedSearchSequence = [
  clearScreenMetadataAction,
  set(state.advancedSearchForm.currentPage, 1),
  setDefaultCountryTypeOnAdvancedSearchFormAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
