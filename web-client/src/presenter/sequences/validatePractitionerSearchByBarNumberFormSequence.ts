import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePractitionerSearchByBarNumberAction } from '../actions/AdvancedSearch/validatePractitionerSearchByBarNumberAction';

export const validatePractitionerSearchByBarNumberFormSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePractitionerSearchByBarNumberAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
