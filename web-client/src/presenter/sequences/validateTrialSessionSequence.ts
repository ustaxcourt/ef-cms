import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeTrialSessionFormDataAction,
      validateTrialSessionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
