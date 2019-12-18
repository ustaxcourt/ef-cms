import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionPlanningAction } from '../actions/validateTrialSessionPlanningAction';

export const validateTrialSessionPlanningSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateTrialSessionPlanningAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
