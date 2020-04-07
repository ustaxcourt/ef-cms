import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const validateAddPractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateAction,
      validateAddPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
