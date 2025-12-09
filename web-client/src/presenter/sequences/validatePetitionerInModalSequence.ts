import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionerInModalAction } from '../actions/validatePetitionerInModalAction';

export const validatePetitionerInModalSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionerInModalAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
