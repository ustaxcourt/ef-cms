import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocumentToFormAction } from '../actions/EditUploadCourtIssuedDocument/setDocumentToFormAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditUploadCourtIssuedDocument =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    setRedirectUrlAction,
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocumentToFormAction,
    setCurrentPageAction('EditUploadCourtIssuedDocument'),
  ]);

export const gotoEditUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditUploadCourtIssuedDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
