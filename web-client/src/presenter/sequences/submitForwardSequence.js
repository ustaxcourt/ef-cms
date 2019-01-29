import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import clearForwardFormAction from '../actions/clearForwardFormAction';
import forwardWorkItemAction from '../actions/forwardWorkItemAction';
import navigateToDashboardAction from '../actions/navigateToDashboardAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  setFormSubmitting,
  clearAlerts,
  forwardWorkItemAction,
  clearForwardFormAction,
  set(state.document.showForwardInputs, false),
  setAlertSuccess,
  unsetFormSubmitting,
  navigateToDashboardAction,
];
