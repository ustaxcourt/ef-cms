import { clearAlertsAction } from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import sendPetitionToIRSHoldingQueueAction from '../actions/sendPetitionToIRSHoldingQueueAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import { clearModalAction } from '../actions/clearModalAction';

export default [
  clearAlertsAction,
  clearModalAction,
  sendPetitionToIRSHoldingQueueAction,
  setAlertSuccess,
  getCase,
  setCase,
  navigateToDashboard,
];
