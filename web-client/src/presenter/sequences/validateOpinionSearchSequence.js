import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const validateOpinionSearchSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateOpinionAdvancedSearchAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction, stopShowValidationAction],
      },
    ],
  },
];
