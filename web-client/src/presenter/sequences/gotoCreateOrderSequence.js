import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openCreateOrderChooseTypeModalSequence } from './openCreateOrderChooseTypeModalSequence';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCreateOrderModalDataOnFormAction } from '../actions/CourtIssuedOrder/setCreateOrderModalDataOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setIsCreatingOrderAction } from '../actions/setIsCreatingOrderAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

export const gotoCaseDetailWithModal = [
  ...openCreateOrderChooseTypeModalSequence,
  navigateToCaseDetailAction,
];

export const gotoCreateOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setRedirectUrlAction,
      hasOrderTypeSelectedAction,
      {
        no: gotoCaseDetailWithModal,
        proceed: [
          unsetDocumentToEditAction,
          clearModalAction,
          setCurrentPageAction('Interstitial'),
          stopShowValidationAction,
          clearFormAction,
          setCreateOrderModalDataOnFormAction,
          convertHtml2PdfSequence,
          setIsCreatingOrderAction,
          setCurrentPageAction('CreateOrder'),
        ],
      },
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
