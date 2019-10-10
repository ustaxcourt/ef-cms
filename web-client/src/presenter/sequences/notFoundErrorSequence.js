import { clearModalAction } from '../actions/clearModalAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const notFoundErrorSequence = [
  unsetWaitingForResponseAction,
  setAlertFromExceptionAction,
  clearModalAction,
  setCurrentPageAction('Error'),
];
