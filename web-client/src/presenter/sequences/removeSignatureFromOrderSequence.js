import { clearAlertsAction } from '../actions/clearAlertsAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';

export const removeSignatureFromOrderSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  setDocumentToEditAction,
  convertHtml2PdfSequence,
  overwriteOrderFileAction,
  {
    error: [], // TODO: show an alert if this occurs?
    success: [
      submitCourtIssuedOrderAction,
      set(state.alertSuccess, {
        message: 'Signature removed.',
        title: '',
      }),
      setCaseAction,
    ],
  },
]);
