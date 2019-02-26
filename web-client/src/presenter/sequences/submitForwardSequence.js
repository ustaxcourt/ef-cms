import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearForwardFormAction } from '../actions/clearForwardFormAction';
import { forwardWorkItemAction } from '../actions/forwardWorkItemAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const submitForwardSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  forwardWorkItemAction,
  clearForwardFormAction,
  set(state.document.showForwardInputs, false),
  setAlertSuccessAction,
  unsetFormSubmittingAction,
  navigateToDashboardAction,
];
