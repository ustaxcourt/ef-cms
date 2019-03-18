import { clearModalAction } from '../actions/clearModalAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const unauthorizedErrorSequence = [
  unsetFormSubmittingAction,
  setAlertFromExceptionAction,
  clearModalAction,
  redirectToCognitoAction,
];
