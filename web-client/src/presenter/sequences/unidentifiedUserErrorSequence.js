import redirectToCognito from '../actions/redirectToCognitoAction';
import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export const unidentifiedUserErrorSequence = [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  redirectToCognito,
];
