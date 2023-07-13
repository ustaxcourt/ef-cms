import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdFromCorrespondenceAction } from '../actions/setDocketEntryIdFromCorrespondenceAction';
import { setDocumentToFormFromCorrespondenceAction } from '../actions/EditUploadCourtIssuedDocument/setDocumentToFormFromCorrespondenceAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditCorrespondenceDocument =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    setDocketEntryIdFromCorrespondenceAction,
    setDocumentToFormFromCorrespondenceAction,
    setRedirectUrlAction,
    setupCurrentPageAction('EditCorrespondenceDocument'),
  ]);

export const gotoEditCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditCorrespondenceDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
