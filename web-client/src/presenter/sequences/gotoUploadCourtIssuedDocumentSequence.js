import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { initializeUploadFormAction } from '../actions/uploadCourtIssuedDocument/initializeUploadFormAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCourtIssuedDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  initializeUploadFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('UploadCourtIssuedDocument'),
];

export const gotoUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCourtIssuedDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
