import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateWorkItemAction } from '../actions/validateWorkItemAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';

export const submitForwardSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  validateWorkItemAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      forwardWorkItemAction,
      clearForwardFormAction,
      set(state.document.showForwardInputs, false),
      setAlertSuccessAction,
      navigateToDashboardAction,
    ],
  },
  unsetFormSubmittingAction,
];
