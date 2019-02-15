import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  setCurrentPage('Error'),
];
