import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  computeTrialSessionFormDataAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getComputedFormDateFactoryAction(null),
      validateTrialSessionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
