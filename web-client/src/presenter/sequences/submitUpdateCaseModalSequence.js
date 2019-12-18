import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitUpdateCaseModalAction } from '../actions/CaseDetail/submitUpdateCaseModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateUpdateCaseModalAction } from '../actions/CaseDetail/validateUpdateCaseModalAction';

export const submitUpdateCaseModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUpdateCaseModalAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      setWaitingForResponseAction,
      submitUpdateCaseModalAction,
      setCaseAction,
      setAlertSuccessAction,
      unsetWaitingForResponseAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
