import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import sendToIrsAction from '../actions/sendPetitionToIrsAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';

export default [
  clearAlerts,
  sendToIrsAction,
  getCase,
  setCase,
  setAlertSuccess,
];
