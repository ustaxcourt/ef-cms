import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryFormForEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForEditAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setupCompleteDocketEntryAction } from '../actions/setupCompleteDocketEntryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDocketEntry = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryFormForEditAction,
  setDocumentIdAction,
  setupCompleteDocketEntryAction,
  setCurrentPageAction('AddDocketEntry'),
];

export const gotoCompleteDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];
