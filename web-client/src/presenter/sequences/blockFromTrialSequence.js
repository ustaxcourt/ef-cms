import { blockFromTrialAction } from '../actions/blockFromTrialAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateBlockFromTrialAction } from '../actions/validateBlockFromTrialAction';

export const blockFromTrialSequence = [
  startShowValidationAction,
  validateBlockFromTrialAction,
  {
    error: [setValidationErrorsAction],
    success: [
      blockFromTrialAction,
      setAlertSuccessAction,
      clearModalAction,
      setCaseAction,
    ],
  },
];
