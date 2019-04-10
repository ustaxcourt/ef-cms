import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { createWorkItemAction } from '../actions/createWorkItemAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

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
      clearFormAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
      refreshCaseAction,
      unsetFormSubmittingAction,
    ],
  },
];
