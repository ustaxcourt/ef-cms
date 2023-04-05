import { clearFormAction } from '../actions/clearFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

/**
 * Navigate to the local page for creating new password when required by cognito, locally
 *
 */
export const gotoChangePasswordLocalSequence = [
  clearFormAction,
  setCurrentPageAction('ChangePasswordLocal'),
];
