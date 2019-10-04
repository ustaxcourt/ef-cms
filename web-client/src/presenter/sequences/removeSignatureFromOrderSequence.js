import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const removeSignatureFromOrderSequence = [
  setWaitingForResponseAction,
  setDocumentToEditAction,
  ...convertHtml2PdfSequence,
  overwriteOrderFileAction,
  {
    error: [unsetWaitingForResponseAction], // TODO: show an alert if this occurs?
    success: [
      submitCourtIssuedOrderAction,
      setCaseAction,
      unsetWaitingForResponseAction,
    ],
  },
];
