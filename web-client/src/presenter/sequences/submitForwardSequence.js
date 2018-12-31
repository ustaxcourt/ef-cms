import { state } from 'cerebral';
import { set } from 'cerebral/factories';
import clearAlerts from '../actions/clearAlertsAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import forwardCaseAction from '../actions/forwardCaseAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import clearFormAction from '../actions/clearFormAction';

export default [
  setFormSubmitting,
  clearAlerts,
  unsetFormSubmitting,
  forwardCaseAction,
  {
    error: [setAlertError],
    success: [
      clearFormAction,
      set(state.document.showForwardInputs, false),
      setAlertSuccess,
    ],
  },
];
