import redirectToCognito from '../actions/redirectToCognitoAction';
import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  redirectToCognito,
];
