import getEnvironment from '../actions/getEnvironmentAction';
import redirectToCognito from '../actions/redirectToCognitoAction';
import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  getEnvironment,
  {
    dev: [redirectToCognito],
    prod: [redirectToCognito],
  },
  // setCurrentPage('LogIn'),
];
