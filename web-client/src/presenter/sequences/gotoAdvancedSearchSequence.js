import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';

export const gotoAdvancedSearchSequence = [
  clearSearchResultsAction,
  clearScreenMetadataAction,
  closeMobileMenuAction,
  defaultAdvancedSearchFormAction,
  getUsersInSectionAction({ section: 'judge' }),
  setUsersByKeyAction('judges'),
  getOpinionTypesAction,
  setOpinionTypesAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
