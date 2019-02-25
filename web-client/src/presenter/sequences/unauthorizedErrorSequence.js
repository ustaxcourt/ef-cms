import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';

export const unauthorizedErrorSequence = [
  unsetFormSubmittingAction,
  setAlertFromExceptionAction,
  redirectToCognitoAction,
];
