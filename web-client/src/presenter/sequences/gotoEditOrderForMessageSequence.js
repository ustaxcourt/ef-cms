import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setupEditOrder } from './gotoEditOrderSequence';

const gotoEditOrder = [
  setupEditOrder,
  setParentMessageIdAction,
  setCurrentPageAction('CreateOrderForMessage'),
];

export const gotoEditOrderForMessageSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditOrder,
    unauthorized: [redirectToCognitoAction],
  },
];
