import clearAlertsAction from '../actions/clearAlertsAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import setValidationErrorsAction from '../actions/setValidationErrorsAction';
import shouldValidateAction from '../actions/shouldValidateAction';
import validatePetitionAction from '../actions/validatePetitionAction';

export default [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionAction,
      {
        success: [clearAlertsAction],
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      },
    ],
  },
];
