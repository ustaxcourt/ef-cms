import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePrioritizeCaseAction } from '../actions/CaseDetail/validatePrioritizeCaseAction';

export const validatePrioritizeCaseSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePrioritizeCaseAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
