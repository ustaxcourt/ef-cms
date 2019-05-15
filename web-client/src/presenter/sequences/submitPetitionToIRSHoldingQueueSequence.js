import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { sendPetitionToIRSHoldingQueueAction } from '../actions/sendPetitionToIRSHoldingQueueAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const submitPetitionToIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  clearCurrentPageHeaderAction,
  sendPetitionToIRSHoldingQueueAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  navigateToDashboardAction,
];
