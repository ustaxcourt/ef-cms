import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { resetAddCorrespondenceAction } from '../actions/resetAddCorrespondenceAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoUploadCorrespondenceDocument =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearScansAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseAction,
    setCaseAction,
    resetAddCorrespondenceAction,
    setupCurrentPageAction('AddCorrespondenceDocument'),
  ]);

export const gotoUploadCorrespondenceDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCorrespondenceDocument],
    unauthorized: [gotoLoginSequence],
  },
];
