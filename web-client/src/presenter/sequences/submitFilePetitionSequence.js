import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import createCase from '../actions/createCaseAction';
import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccessAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import validatePetition from '../actions/validatePetitionAction';

export default [
  clearAlerts,
  validatePetition,
  setFormSubmitting,
  createCase,
  getCreateCaseAlertSuccess,
  setAlertSuccess,
  navigateToDashboard,
  unsetFormSubmitting,
  clearForm,
];
