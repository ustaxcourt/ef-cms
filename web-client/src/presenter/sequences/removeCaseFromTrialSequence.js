import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { removeCaseFromTrialAction } from '../actions/CaseDetail/removeCaseFromTrialAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateRemoveFromTrialSessionAction } from '../actions/CaseDetail/validateRemoveFromTrialSessionAction';

export const removeCaseFromTrialSequence = [
  startShowValidationAction,
  validateRemoveFromTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      removeCaseFromTrialAction,
      unsetWaitingForResponseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ],
  },
];
