import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { prioritizeCaseAction } from '../actions/CaseDetail/prioritizeCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validatePrioritizeCaseAction } from '../actions/CaseDetail/validatePrioritizeCaseAction';

export const prioritizeCaseSequence = [
  startShowValidationAction,
  validatePrioritizeCaseAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      prioritizeCaseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ]),
  },
];
