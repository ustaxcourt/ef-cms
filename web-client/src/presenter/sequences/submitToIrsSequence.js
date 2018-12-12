import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import getCase from '../actions/getCaseAction';
import sendToIrsAction from '../actions/sendPetitionToIrsAction';

export default [
  clearAlerts,
  sendToIrsAction,
  {
    error: [setAlertError],
    success: [getCase, setCase, setAlertSuccess],
  },
];
