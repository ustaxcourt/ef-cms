import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePractitionerSearchByNameAction } from '../actions/AdvancedSearch/validatePractitionerSearchByNameAction';

export const validatePractitionerSearchByNameFormSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePractitionerSearchByNameAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
