import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoUserContactEditSequence = [
  clearAlertsAction,
  setCurrentPageAction('UserContactEdit'),
];
