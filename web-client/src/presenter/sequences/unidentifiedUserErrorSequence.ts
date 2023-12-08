import { clearModalAction } from '../actions/clearModalAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const unidentifiedUserErrorSequence = [
  unsetWaitingForResponseOnErrorAction,
  setAlertFromExceptionAction,
  clearModalAction,
  navigateToLoginSequence,
];
