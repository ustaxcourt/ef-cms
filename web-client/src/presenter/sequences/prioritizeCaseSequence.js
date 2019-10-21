import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { prioritizeCaseAction } from '../actions/CaseDetail/prioritizeCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validatePrioritizeCaseAction } from '../actions/CaseDetail/validatePrioritizeCaseAction';

export const prioritizeCaseSequence = [
  startShowValidationAction,
  validatePrioritizeCaseAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      prioritizeCaseAction,
      unsetWaitingForResponseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ],
  },
];
