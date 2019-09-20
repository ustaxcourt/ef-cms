import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/ForwardForm/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startForwardValidationAction } from '../actions/ForwardForm/startForwardValidationAction';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';

export const submitForwardSequence = [
  setWaitingForResponseAction,
  startForwardValidationAction,
  clearAlertsAction,
  validateForwardMessageAction,
  {
    error: [
      setAlertErrorAction,
      setForwardMessageValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      forwardWorkItemAction,
      clearForwardFormAction,
      unsetShowForwardInputs,
      setAlertSuccessAction,
      navigateToDashboardAction,
    ],
  },
  unsetWaitingForResponseAction,
];
