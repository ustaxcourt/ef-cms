import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDeadlineAction } from '../actions/CaseDeadline/validateCaseDeadlineAction';

export const validateCaseDeadlineSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseDeadlineAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
