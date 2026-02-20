import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { resetAddCorrespondenceAction } from '../actions/resetAddCorrespondenceAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoUploadCorrespondenceDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearScansAction,
    clearFormAction,
    clearScreenMetadataAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    resetAddCorrespondenceAction,
    setupCurrentPageAction('AddCorrespondenceDocument'),
  ]);
