import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateChangePetitionerLoginAndServiceEmailAction } from '../actions/validateChangePetitionerLoginAndServiceEmailAction';

export const validateChangePetitionerLoginAndServiceEmailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateChangePetitionerLoginAndServiceEmailAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
