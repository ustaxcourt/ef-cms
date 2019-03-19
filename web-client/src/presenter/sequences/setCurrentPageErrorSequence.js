import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { clearModalAction } from '../actions/clearModalAction';

export const setCurrentPageErrorSequence = [
  set(state.submitting, false),
  setAlertFromExceptionAction,
  clearModalAction,
];
