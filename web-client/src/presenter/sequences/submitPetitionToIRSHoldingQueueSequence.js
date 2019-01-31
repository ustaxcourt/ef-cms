import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import sendPetitionToIRSHoldingQueueAction from '../actions/sendPetitionToIRSHoldingQueueAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import { state } from 'cerebral';
import { set } from 'cerebral/factories';

export default [
  clearAlerts,
  set(state.modal, ''),
  sendPetitionToIRSHoldingQueueAction,
  setAlertSuccess,
  getCase,
  setCase,
  navigateToDashboard,
];
