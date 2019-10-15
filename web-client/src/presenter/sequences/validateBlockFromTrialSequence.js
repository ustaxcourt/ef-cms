import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateBlockFromTrialAction } from '../actions/validateBlockFromTrialAction';

export const validateBlockFromTrialSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateBlockFromTrialAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
