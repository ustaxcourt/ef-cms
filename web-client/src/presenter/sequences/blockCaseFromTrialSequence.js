import { blockCaseFromTrialAction } from '../actions/CaseDetail/blockCaseFromTrialAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateBlockFromTrialAction } from '../actions/CaseDetail/validateBlockFromTrialAction';

export const blockCaseFromTrialSequence = [
  startShowValidationAction,
  validateBlockFromTrialAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      blockCaseFromTrialAction,
      unsetWaitingForResponseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ],
  },
];
