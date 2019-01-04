import { state } from 'cerebral';
import { set } from 'cerebral/factories';
import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import forwardWorkItemAction from '../actions/forwardWorkItemAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import clearForwardFormAction from '../actions/clearForwardFormAction';

export default [
  setFormSubmitting,
  clearAlerts,
  unsetFormSubmitting,
  forwardWorkItemAction,
  {
    error: [setAlertError],
    success: [
      clearForwardFormAction,
      set(state.document.showForwardInputs, false),
      setAlertSuccess,
    ],
  },
];
