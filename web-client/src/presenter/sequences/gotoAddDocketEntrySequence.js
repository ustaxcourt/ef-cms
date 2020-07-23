import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetAddDocketEntryAction } from '../actions/resetAddDocketEntryAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentIdAction } from '../actions/unsetDocumentIdAction';

export const gotoAddDocketEntry = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  unsetDocumentIdAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  resetAddDocketEntryAction,
  set(state.isPaperFiling, true),
  setCurrentPageAction('AddDocketEntry'),
];

export const gotoAddDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];
