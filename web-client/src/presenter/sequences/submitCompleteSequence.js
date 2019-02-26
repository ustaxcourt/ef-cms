import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCompleteFormAction } from '../actions/clearCompleteFormAction';
import { completeWorkItemAction } from '../actions/completeWorkItemAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const submitCompleteSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  completeWorkItemAction,
  clearCompleteFormAction,
  set(state.document.showForwardInputs, false), // TODO
  setAlertSuccessAction,
  unsetFormSubmittingAction,
];
