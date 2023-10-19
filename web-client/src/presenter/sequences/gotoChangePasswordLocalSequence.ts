import { clearFormAction } from '../actions/clearFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoChangePasswordLocalSequence = [
  clearFormAction,
  setupCurrentPageAction('ChangePasswordLocal'),
];
