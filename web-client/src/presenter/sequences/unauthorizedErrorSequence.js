import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetFormSubmitting } from '../actions/unsetFormSubmittingAction';
import { redirectToCognito } from '../actions/redirectToCognitoAction';

export const unauthorizedErrorSequence = [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  redirectToCognito,
];
