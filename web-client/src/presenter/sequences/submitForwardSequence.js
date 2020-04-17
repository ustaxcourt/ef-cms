import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/ForwardForm/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startForwardValidationAction } from '../actions/ForwardForm/startForwardValidationAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';

export const submitForwardSequence = showProgressSequenceDecorator([
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
      setAlertSuccessAction,
      navigateToDashboardAction,
    ],
  },
]);
