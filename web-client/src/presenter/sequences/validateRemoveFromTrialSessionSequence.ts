import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateRemoveFromTrialSessionAction } from '../actions/CaseDetail/validateRemoveFromTrialSessionAction';

export const validateRemoveFromTrialSessionSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateRemoveFromTrialSessionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
