import clearAlerts from '../actions/clearAlerts';
import setAlertError from '../actions/setAlertError';
import setAlertSuccess from '../actions/setAlertSuccess';
import setCase from '../actions/setCase';
import sendToIRSAction from '../actions/sendPetitionToIRS';

export default [
  clearAlerts,
  sendToIRSAction,
  {
    error: [setAlertError],
    success: [setCase, setAlertSuccess],
  },
];
