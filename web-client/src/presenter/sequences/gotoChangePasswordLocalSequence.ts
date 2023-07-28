import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

/**
 * Navigate to the local page for creating new password when required by cognito, locally
 *
 */
export const gotoChangePasswordLocalSequence = [
  clearFormAction,
  setupCurrentPageAction('ChangePasswordLocal'),
];
