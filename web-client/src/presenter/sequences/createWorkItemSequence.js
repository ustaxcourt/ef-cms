import { createWorkItemAction } from '../actions/createWorkItemAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const createWorkItemSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  createWorkItemAction,
  {
    success: [setAlertSuccessAction],
  },
  clearModalAction,
  refreshCaseAction,
  unsetFormSubmittingAction,
];
