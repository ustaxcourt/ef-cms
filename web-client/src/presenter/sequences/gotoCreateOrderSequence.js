import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentToEditAction } from '../actions/getDocumentToEditAction';
import { getIsEditDocumentAction } from '../actions/getIsEditDocumentAction';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openCreateOrderChooseTypeModalSequence } from './openCreateOrderChooseTypeModalSequence';
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
        proceed: [
          getIsEditDocumentAction,
          {
            edit: [getCaseAction, getDocumentToEditAction, gotoCreateOrder],
            new: gotoCreateOrder,
          },
        ],
      },
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
