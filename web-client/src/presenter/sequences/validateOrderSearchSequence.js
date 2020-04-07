import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateOrderAdvancedSearchAction } from '../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const validateOrderSearchSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateOrderAdvancedSearchAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction, stopShowValidationAction],
      },
    ],
  },
];
