import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openCreateOrderChooseTypeModalSequence } from './openCreateOrderChooseTypeModalSequence';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setCreateOrderModalDataOnFormAction } from '../actions/CourtIssuedOrder/setCreateOrderModalDataOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unset } from 'cerebral/factories';

const gotoCreateOrder = [
  unset(state.documentToEdit),
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  setCasePropFromStateAction,
  setCreateOrderModalDataOnFormAction,
  ...convertHtml2PdfSequence,
  setCurrentPageAction('CreateOrder'),
];

const gotoCaseDetailWithModal = [
  ...openCreateOrderChooseTypeModalSequence,
  navigateToCaseDetailAction,
];

export const gotoCreateOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      hasOrderTypeSelectedAction,
      {
        no: gotoCaseDetailWithModal,
        proceed: gotoCreateOrder,
      },
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
