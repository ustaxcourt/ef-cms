import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const validateCaseDetailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getFormCombinedWithCaseDetailAction,
      validateCaseDetailAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
