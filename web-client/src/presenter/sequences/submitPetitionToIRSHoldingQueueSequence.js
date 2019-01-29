import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import getCase from '../actions/getCaseAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import sendPetitionToIRSHoldingQueueAction from '../actions/sendPetitionToIRSHoldingQueueAction';

export default [
  clearAlerts,
  sendPetitionToIRSHoldingQueueAction,
  {
    error: [setAlertError],
    success: [setAlertSuccess, getCase, setCase, navigateToDashboard],
  },
];
