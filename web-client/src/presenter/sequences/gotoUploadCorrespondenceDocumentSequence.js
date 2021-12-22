import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetAddCorrespondenceAction } from '../actions/resetAddCorrespondenceAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCorrespondenceDocument =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    resetAddCorrespondenceAction,
    setCurrentPageAction('AddCorrespondenceDocument'),
  ]);

export const gotoUploadCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCorrespondenceDocument],
    unauthorized: [redirectToCognitoAction],
  },
];
