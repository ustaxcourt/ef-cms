import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const notFoundErrorSequence = [
  clearCurrentPageHeaderAction,
  unsetFormSubmittingAction,
  setAlertFromExceptionAction,
  clearModalAction,
  setCurrentPageAction('Error'),
];
