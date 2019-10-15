import { blockFromTrialAction } from '../actions/CaseDetail/blockFromTrialAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateBlockFromTrialAction } from '../actions/CaseDetail/validateBlockFromTrialAction';

export const blockFromTrialSequence = [
  startShowValidationAction,
  validateBlockFromTrialAction,
  {
    error: [setValidationErrorsAction],
    success: [
      blockFromTrialAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ],
  },
];
