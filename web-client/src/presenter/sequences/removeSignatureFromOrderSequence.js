import { clearAlertsAction } from '../actions/clearAlertsAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const removeSignatureFromOrderSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  setDocumentToEditAction,
  ...convertHtml2PdfSequence,
  overwriteOrderFileAction,
  {
    error: [unsetWaitingForResponseAction], // TODO: show an alert if this occurs?
    success: [
      submitCourtIssuedOrderAction,
      set(state.alertSuccess, {
        message: 'Your signature has been removed',
        title: '',
      }),
      setCaseAction,
      unsetWaitingForResponseAction,
    ],
  },
];
