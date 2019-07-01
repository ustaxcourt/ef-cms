import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseIdPropFromStateAction } from '../actions/setCaseIdPropFromStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoCreateOrder = [
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearAlertsAction,
  clearScreenMetadataAction,
  setCaseIdPropFromStateAction,
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
