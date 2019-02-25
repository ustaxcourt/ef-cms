import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionAction } from '../actions/validatePetitionAction';

export const validateStartCaseSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionAction,
      {
        success: [clearAlertsAction],
        error: [setValidationErrorsAction],
      },
    ],
  },
];
