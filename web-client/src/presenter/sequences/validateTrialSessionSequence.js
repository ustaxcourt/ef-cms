import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { computeTermFromStartDate } from '../actions/TrialSession/computeTermFromStartDate';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  computeTermFromStartDate,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateAction,
      validateTrialSessionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
