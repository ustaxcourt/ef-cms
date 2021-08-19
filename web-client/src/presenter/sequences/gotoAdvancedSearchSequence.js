import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';

export const gotoAdvancedSearchSequence = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  defaultAdvancedSearchFormAction,
  getUsersInSectionAction({ section: 'judge' }),
  setAllAndCurrentJudgesAction,
  getOpinionTypesAction,
  setOpinionTypesAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
