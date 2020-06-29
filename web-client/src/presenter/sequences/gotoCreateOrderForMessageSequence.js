import {
  gotoCaseDetailWithModal,
  setupCreateOrder,
} from './gotoCreateOrderSequence';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoCreateOrderForMessageSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      hasOrderTypeSelectedAction,
      {
        no: gotoCaseDetailWithModal,
        proceed: [
          setupCreateOrder,
          setCurrentPageAction('CreateOrderForMessage'),
        ],
      },
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
