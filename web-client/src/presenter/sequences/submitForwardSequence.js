import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/ForwardForm/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';
import { startForwardValidationAction } from '../actions/ForwardForm/startForwardValidationAction';

export const submitForwardSequence = [
  setFormSubmittingAction,
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
  unsetFormSubmittingAction,
];
