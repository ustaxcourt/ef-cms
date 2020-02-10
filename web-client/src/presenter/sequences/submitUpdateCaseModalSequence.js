import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitUpdateCaseModalAction } from '../actions/CaseDetail/submitUpdateCaseModalAction';
import { validateUpdateCaseModalAction } from '../actions/CaseDetail/validateUpdateCaseModalAction';

export const submitUpdateCaseModalSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  validateUpdateCaseModalAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      setWaitingForResponseAction,
      submitUpdateCaseModalAction,
      setCaseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
]);
