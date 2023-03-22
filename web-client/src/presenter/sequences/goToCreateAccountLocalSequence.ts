import { clearFormAction } from '../actions/clearFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

/**
 * Navigate to the local page for creating a new account
 *
 */
export const goToCreateAccountLocalSequence = [
  clearFormAction,
  // clearSessionMetadataAction,
  setCurrentPageAction('CreateNewAccountLocal'),
];
