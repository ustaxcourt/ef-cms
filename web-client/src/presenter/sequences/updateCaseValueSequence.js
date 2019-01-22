import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import clearAlerts from '../actions/clearAlertsAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  set(state.form[props.key], props.value),
  validateCaseDetail,
  {
    success: [set(state.caseDetail[props.key], props.value)],
    error: [set(state.caseDetailErrors, props.errors)],
  },
];
