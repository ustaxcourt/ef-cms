import { clearFormAction } from '../actions/clearFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoChangeLoginAndServiceEmailSequence = [
  clearFormAction,
  setCurrentPageAction('ChangeLoginAndServiceEmail'),
];
