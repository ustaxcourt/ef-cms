import clearAlerts from '../actions/clearAlertsAction';
import getForwardCaseAlertSuccess from '../actions/getForwardCaseAlertSuccessAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  setFormSubmitting,
  clearAlerts,
  // TODO forwardAction
  unsetFormSubmitting,
  getForwardCaseAlertSuccess,
  setAlertSuccess,
  // TODO reset forward form content
];
