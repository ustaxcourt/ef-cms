import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboard } from '../actions/navigateToDashboardAction';
import { recallPetitionFromIRSHoldingQueue } from '../actions/recallPetitionFromIRSHoldingQueueAction';
import { setAlertSuccess } from '../actions/setAlertSuccessAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCase } from '../actions/getCaseAction';
import { setCase } from '../actions/setCaseAction';

export const submitRecallPetitionFromIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  recallPetitionFromIRSHoldingQueue,
  getCase,
  setCase,
  setAlertSuccess,
  navigateToDashboard,
];
