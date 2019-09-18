import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { recallPetitionFromIRSHoldingQueueAction } from '../actions/recallPetitionFromIRSHoldingQueueAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const submitRecallPetitionFromIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  recallPetitionFromIRSHoldingQueueAction,
  setCurrentPageAction('Interstitial'),
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('DocumentDetail'),
];
