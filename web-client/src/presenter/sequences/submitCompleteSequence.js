import { state } from 'cerebral';
import { set } from 'cerebral/factories';
import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import completeWorkItemAction from '../actions/completeWorkItemAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import clearCompleteFormAction from '../actions/clearCompleteFormAction';

export default [
  setFormSubmitting,
  clearAlerts,
  unsetFormSubmitting,
  completeWorkItemAction,
  {
    error: [setAlertError],
    success: [
      clearCompleteFormAction,
      set(state.document.showForwardInputs, false), // TODO
      setAlertSuccess,
    ],
  },
];
