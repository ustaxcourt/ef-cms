import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const unidentifiedUserErrorSequence = [
  unsetFormSubmittingAction,
  setAlertFromExceptionAction,
  redirectToCognitoAction,
];
