import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetAddPaperFilingAction } from '../actions/resetAddPaperFilingAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocketEntryIdAction } from '../actions/unsetDocketEntryIdAction';

export const gotoAddPaperFiling = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  unsetDocketEntryIdAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  resetAddPaperFilingAction,
  setCurrentPageAction('PaperFiling'),
];

export const gotoAddPaperFilingSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddPaperFiling,
    unauthorized: [redirectToCognitoAction],
  },
];
