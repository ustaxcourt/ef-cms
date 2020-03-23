import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoAdvancedSearchSequence = [
  clearScreenMetadataAction,
  closeMobileMenuAction,
  defaultAdvancedSearchFormAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
