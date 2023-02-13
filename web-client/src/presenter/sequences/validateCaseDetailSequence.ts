import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const validateCaseDetailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getCaseDetailFormWithComputedDatesAction,
      validateCaseDetailAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
