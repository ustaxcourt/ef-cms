import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import updateCase from '../actions/updateCaseAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  clearForm,
  validateCaseDetail,
  {
    success: [set(state.caseDetail[props.key], props.value)],
    error: [set(state.caseDetailErrors, props.errors)],
  },
  updateCase,
  {
    error: [setAlertError],
    success: [setCase, setAlertSuccess, clearForm],
  },
];
