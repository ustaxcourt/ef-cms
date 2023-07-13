import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCourtIssuedDocument = startWebSocketConnectionSequenceDecorator(
  [
    setCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    setCurrentPageAction('UploadCourtIssuedDocument'),
  ],
);

export const gotoUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCourtIssuedDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
