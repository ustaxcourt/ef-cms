import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { hasOrderTypeSelectedAction } from '../actions/CourtIssuedOrder/hasOrderTypeSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { openCreateOrderChooseTypeModalSequence } from './openCreateOrderChooseTypeModalSequence';
import { setCreateOrderModalDataOnFormAction } from '../actions/CourtIssuedOrder/setCreateOrderModalDataOnFormAction';
import { setIsCreatingOrderAction } from '../actions/setIsCreatingOrderAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSelectedConsolidatedCasesToMultiDocketOnAction } from '@web-client/presenter/actions/setSelectedConsolidatedCasesToMultiDocketOnAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
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
          setSelectedConsolidatedCasesToMultiDocketOnAction(false),
          setupCurrentPageAction('Interstitial'),
          stopShowValidationAction,
          clearFormAction,
          setCreateOrderModalDataOnFormAction,
          setIsCreatingOrderAction,
          convertHtml2PdfSequence,
          setupCurrentPageAction('CreateOrder'),
        ],
      },
    ]),
    unauthorized: [navigateToLoginSequence],
  },
];
