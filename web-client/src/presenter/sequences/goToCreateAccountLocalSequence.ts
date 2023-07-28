import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

/**
 * Navigate to the local page for creating a new account
 *
 */
export const goToCreateAccountLocalSequence = [
  clearFormAction,
  setupCurrentPageAction('CreateNewAccountLocal'),
];
