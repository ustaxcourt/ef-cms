import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCorrespondenceDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('UploadCorrespondenceDocument'),
];

export const gotoUploadCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCorrespondenceDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
