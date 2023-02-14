import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computePetitionDatesAction } from '../actions/computePetitionDatesAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDetailsAction } from '../actions/validateCaseDetailsAction';

export const validateCaseDetailsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computePetitionDatesAction,
      validateCaseDetailsAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
