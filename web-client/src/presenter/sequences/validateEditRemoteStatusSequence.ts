import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateBlockFromTrialAction } from '../actions/CaseDetail/validateBlockFromTrialAction';

export const validateEditRemoteStatusSequence = [
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
