import { clearModalAction } from '../actions/clearModalAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const unauthorizedErrorSequence = [
  unsetWaitingForResponseAction,
  setAlertFromExceptionAction,
  clearModalAction,
  redirectToCognitoAction,
];
