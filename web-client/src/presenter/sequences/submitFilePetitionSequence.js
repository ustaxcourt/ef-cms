import clearAlerts from '../actions/clearAlertsAction';
import createCase from '../actions/createCaseAction';
import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccessAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setAlertError from '../actions/setAlertErrorAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import validatePetition from '../actions/validatePetitionAction';

export default [
  clearAlerts,
  validatePetition,
  {
    success: [
      setFormSubmitting,
      createCase,
      unsetFormSubmitting,
      getCreateCaseAlertSuccess,
      setAlertSuccess,
      navigateToDashboard,
    ],
    error: [setAlertError],
  },
];
