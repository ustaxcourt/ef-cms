import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCourtIssuedDocument = startWebSocketConnectionSequenceDecorator(
  [
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    setupCurrentPageAction('UploadCourtIssuedDocument'),
  ],
);

export const gotoUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCourtIssuedDocument],
    unauthorized: [gotoLoginSequence],
  },
];
