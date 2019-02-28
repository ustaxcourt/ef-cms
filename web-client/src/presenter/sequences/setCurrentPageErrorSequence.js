import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';

export const setCurrentPageErrorSequence = [
  set(state.submitting, false),
  setAlertFromExceptionAction,
];
