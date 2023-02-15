import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateSetForHearingAction } from '../actions/CaseDetail/validateSetForHearingAction';

export const validateSetForHearingSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateSetForHearingAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
