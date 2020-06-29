import { clearAlertsAction } from '../actions/clearAlertsAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';

export const removeSignatureAndGotoEditSignatureSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    setDocumentToEditAction,
    ...convertHtml2PdfSequence,
    overwriteOrderFileAction,
    {
      error: [], // TODO: show an alert if this occurs?
      success: [submitCourtIssuedOrderAction, navigateToSignOrderAction],
    },
  ],
);
