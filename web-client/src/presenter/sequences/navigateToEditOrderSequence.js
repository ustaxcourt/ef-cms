import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setupConfirmWithPropsAction } from '../actions/setupConfirmWithPropsAction';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unset } from 'cerebral/factories';

export const navigateToEditOrderSequence = [
  setupConfirmWithPropsAction,
  unset(state.documentToEdit),
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearFormAction,
  getCaseAction,
  setCaseAction,
  setDocumentToEditAction,
  ...convertHtml2PdfSequence,
  overwriteOrderFileAction,
  {
    error: [], // TODO: show an alert if this occurs?
    success: [submitCourtIssuedOrderAction, navigateToPathAction],
  },
];
