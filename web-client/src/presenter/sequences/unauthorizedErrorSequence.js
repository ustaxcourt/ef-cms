import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import navigateToErrorAction from '../actions/navigateToErrorAction';

export default [
  set(state.submitting, false),
  setAlertFromExceptionAction,
  navigateToErrorAction,
];
