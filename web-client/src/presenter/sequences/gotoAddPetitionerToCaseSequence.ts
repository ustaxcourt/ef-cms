import { clearFormAction } from '../actions/clearFormAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setDefaultAddPetitionerToCaseFormAction } from '../actions/setDefaultAddPetitionerToCaseFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddPetitionerToCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    setDefaultAddPetitionerToCaseFormAction,
    setupCurrentPageAction('AddPetitionerToCase'),
  ]);
