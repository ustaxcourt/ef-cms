import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';
import { unstashCreateOrderModalDataAction } from '../actions/CourtIssuedOrder/unstashCreateOrderModalDataAction';

const gotoCreateOrder = [
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearAlertsAction,
  clearFormAction,
  setCasePropFromStateAction,
  unstashCreateOrderModalDataAction,
  ...convertHtml2PdfSequence,
  setCurrentPageAction('CreateOrder'),
];

export const gotoCreateOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoCreateOrder,
    unauthorized: [redirectToCognitoAction],
  },
];
