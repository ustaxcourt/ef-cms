import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const goToCreateAccountLocalSequence = [
  clearFormAction,
  setupCurrentPageAction('CreateNewAccountLocal'),
];
