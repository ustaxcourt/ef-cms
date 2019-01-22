import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import validateCaseDetail from '../actions/validateCaseDetailAction';
import setAlertError from '../actions/setAlertErrorAction';

export default [
  validateCaseDetail,
  {
    success: [set(state.caseDetail[props.key], props.value)],
    error: [setAlertError],
  },
];
