import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  setCurrentPage('Error'),
];
