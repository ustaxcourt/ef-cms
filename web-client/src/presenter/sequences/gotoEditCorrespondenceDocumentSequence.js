import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryIdFromCorrespondenceAction } from '../actions/setDocketEntryIdFromCorrespondenceAction';
import { setDocumentToFormFromCorrespondenceAction } from '../actions/editUploadCourtIssuedDocument/setDocumentToFormFromCorrespondenceAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditCorrespondenceDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryIdFromCorrespondenceAction,
  setDocumentToFormFromCorrespondenceAction,
  setRedirectUrlAction,
  setCurrentPageAction('EditCorrespondenceDocument'),
];

export const gotoEditCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoEditCorrespondenceDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
