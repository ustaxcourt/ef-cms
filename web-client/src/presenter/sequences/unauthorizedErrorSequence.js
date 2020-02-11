import { clearModalAction } from '../actions/clearModalAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const unauthorizedErrorSequence = [
  unsetWaitingForResponseOnErrorAction,
  setAlertFromExceptionAction,
  clearModalAction,
  redirectToCognitoAction,
];
