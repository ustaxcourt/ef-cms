import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';

export default [set(state.submitting, false), setAlertFromExceptionAction];
