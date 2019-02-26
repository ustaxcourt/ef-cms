import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeIrsNoticeDateAction } from '../actions/computeIrsNoticeDateAction';
import setValidationErrorsAction from '../actions/setValidationErrorsAction';
import shouldValidateAction from '../actions/shouldValidateAction';
import validatePetitionAction from '../actions/validatePetitionAction';

export default [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeIrsNoticeDateAction,
      validatePetitionAction,
      {
        success: [clearAlertsAction],
        error: [setValidationErrorsAction],
      },
    ],
  },
];
