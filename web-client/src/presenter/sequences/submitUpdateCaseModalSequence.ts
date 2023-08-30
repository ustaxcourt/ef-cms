import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
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
      submitUpdateCaseModalAction,
      setCaseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
]);
