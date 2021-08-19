import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPetitionerAction } from '../actions/validateAddPetitionerAction';

export const validateAddPetitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddPetitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
