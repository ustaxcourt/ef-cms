import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { recallPetitionFromIRSHoldingQueueAction } from '../actions/recallPetitionFromIRSHoldingQueueAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';

export const submitRecallPetitionFromIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  recallPetitionFromIRSHoldingQueueAction,
  getCaseAction,
  setCaseAction,
  setAlertSuccessAction,
  navigateToDashboardAction,
];
