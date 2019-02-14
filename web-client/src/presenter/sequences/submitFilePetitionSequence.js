import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import createCase from '../actions/createCaseAction';
import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccessAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import setValidationErrorsAction from '../actions/setValidationErrorsAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import validatePetition from '../actions/validatePetitionAction';

export default [
  clearAlerts,
  validatePetition,
  {
    success: [
      setFormSubmitting,
      createCase,
      getCreateCaseAlertSuccess,
      setAlertSuccess,
      navigateToDashboard,
      unsetFormSubmitting,
      clearForm,
    ],
    error: [
      setAlertError,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
      unsetFormSubmitting,
    ],
  },
];
