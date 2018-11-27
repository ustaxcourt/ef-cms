import clearAlerts from '../actions/clearAlerts';
import createCase from '../actions/createCase';
import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccess';
import navigateToDashboard from '../actions/navigateToDashboard';
import setAlertSuccess from '../actions/setAlertSuccess';
import setFormSubmitting from '../actions/setFormSubmitting';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';

export default [
  setFormSubmitting,
  clearAlerts,
  createCase,
  unsetFormSubmitting,
  getCreateCaseAlertSuccess,
  setAlertSuccess,
  navigateToDashboard,
];
