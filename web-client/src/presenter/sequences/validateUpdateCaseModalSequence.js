import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateUpdateCaseModalAction } from '../actions/CaseDetail/validateUpdateCaseModalAction';

export const validateUpdateCaseModalSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateUpdateCaseModalAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
