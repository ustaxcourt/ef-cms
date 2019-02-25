import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetFormSubmitting } from '../actions/unsetFormSubmittingAction';
import { setCurrentPage } from '../actions/setCurrentPageAction';

export const notFoundErrorSequence = [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  setCurrentPage('Error'),
];
