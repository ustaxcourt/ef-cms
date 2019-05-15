import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { recallPetitionFromIRSHoldingQueueAction } from '../actions/recallPetitionFromIRSHoldingQueueAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const submitRecallPetitionFromIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  recallPetitionFromIRSHoldingQueueAction,
  setCurrentPageAction('Interstitial'),
  clearCurrentPageHeaderAction,
  setAlertSuccessAction,
  navigateToDashboardAction,
];
