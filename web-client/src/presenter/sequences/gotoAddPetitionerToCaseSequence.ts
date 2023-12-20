import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultAddPetitionerToCaseFormAction } from '../actions/setDefaultAddPetitionerToCaseFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddPetitionerToCaseSequence = [
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    getCaseAction,
    setCaseAction,
    setDefaultAddPetitionerToCaseFormAction,
    setupCurrentPageAction('AddPetitionerToCase'),
  ]),
];
