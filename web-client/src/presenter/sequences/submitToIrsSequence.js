import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import getCase from '../actions/getCaseAction';
import sendToIRSAction from '../actions/sendPetitionToIrsAction';

export default [
  clearAlerts,
  sendToIRSAction,
  {
    error: [setAlertError],
    success: [getCase, setCase, setAlertSuccess],
  },
];
