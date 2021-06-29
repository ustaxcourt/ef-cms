import { resetHeaderAccordionsSequence } from '../sequences/resetHeaderAccordionsSequence';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoMyAccountSequence = [
  setCurrentPageAction('MyAccount'),
  resetHeaderAccordionsSequence,
];
