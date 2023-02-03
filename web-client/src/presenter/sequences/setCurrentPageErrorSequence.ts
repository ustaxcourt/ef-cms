import { clearModalAction } from '../actions/clearModalAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const setCurrentPageErrorSequence = [
  setCurrentPageAction('Interstitial'),
  unsetWaitingForResponseOnErrorAction,
  setAlertFromExceptionAction,
  clearModalAction,
];
