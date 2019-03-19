import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCompleteFormAction } from '../actions/clearCompleteFormAction';
import { completeWorkItemAction } from '../actions/completeWorkItemAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';

export const submitCompleteSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  completeWorkItemAction,
  refreshCaseAction,
  clearCompleteFormAction,
  unsetShowForwardInputs,
  setAlertSuccessAction,
  unsetFormSubmittingAction,
];
