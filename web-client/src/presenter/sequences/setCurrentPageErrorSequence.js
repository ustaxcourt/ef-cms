import { clearModalAction } from '../actions/clearModalAction';
import { set } from 'cerebral/factories';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { state } from 'cerebral';

export const setCurrentPageErrorSequence = [
  set(state.submitting, false),
  setAlertFromExceptionAction,
  clearModalAction,
];
