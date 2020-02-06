import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentToFormAction } from '../actions/editUploadCourtIssuedDocument/setDocumentToFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditUploadCourtIssuedDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setDocumentToFormAction,
  setCurrentPageAction('EditUploadCourtIssuedDocument'),
];

export const gotoEditUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoEditUploadCourtIssuedDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
