import { clearFormAction } from '../actions/clearFormAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupEditPetitionDetailFormAction } from '../actions/setupEditPetitionDetailFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditCaseDetailsSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    clearFormAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    stopShowValidationAction,
    setupEditPetitionDetailFormAction,
    setupCurrentPageAction('EditCaseDetails'),
  ]);
