import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { overwriteOrderFileAction } from '../actions/CourtIssuedOrder/overwriteOrderFileAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setPropsForRemoveSignatureAction } from '../actions/setPropsForRemoveSignatureAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitCourtIssuedOrderAction } from '../actions/CourtIssuedOrder/submitCourtIssuedOrderAction';

export const removeSignatureAndGotoEditSignatureSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    setPropsForRemoveSignatureAction,
    setDocumentToEditAction,
    ...convertHtml2PdfSequence,
    clearModalAction,
    clearModalStateAction,
    overwriteOrderFileAction,
    {
      error: [], // TODO: show an alert if this occurs?
      success: [submitCourtIssuedOrderAction, navigateToSignOrderAction],
    },
  ],
);
