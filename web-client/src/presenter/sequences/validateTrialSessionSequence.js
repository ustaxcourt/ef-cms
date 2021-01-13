import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  computeTrialSessionFormDataAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateFactoryAction(null),
      validateTrialSessionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
