import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { initializeUploadFormAction } from '../actions/uploadCourtIssuedDocument/initializeUploadFormAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCorrespondenceToEditAction } from '../actions/setCorrespondenceToEditAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditCorrespondenceDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  initializeUploadFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setCorrespondenceToEditAction,
  setCurrentPageAction('EditCorrespondenceDocument'),
];

export const gotoEditCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoEditCorrespondenceDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
