import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import validateCaseDetailAction from '../actions/validateCaseDetailAction';

export default [
  validateCaseDetailAction,
  set(state.caseDetail[props.key], props.value)
];
