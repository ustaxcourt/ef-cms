import { createWorkItemAction } from '../actions/createWorkItemAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';

export const createWorkItemSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setFormSubmittingAction,
      createWorkItemAction,
      {
        success: [stopShowValidationAction, setAlertSuccessAction],
      },
      clearModalAction,
      refreshCaseAction,
      unsetFormSubmittingAction,
    ],
  },
];
