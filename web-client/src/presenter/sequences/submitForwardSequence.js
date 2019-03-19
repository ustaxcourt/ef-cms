import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';

export const submitForwardSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  validateForwardMessageAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
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
