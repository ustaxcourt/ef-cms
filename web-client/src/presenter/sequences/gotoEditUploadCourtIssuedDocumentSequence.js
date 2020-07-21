import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setDocumentToFormAction } from '../actions/editUploadCourtIssuedDocument/setDocumentToFormAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditUploadCourtIssuedDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  setRedirectUrlAction,
  getCaseAction,
  setCaseAction,
  setDocumentIdAction,
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
