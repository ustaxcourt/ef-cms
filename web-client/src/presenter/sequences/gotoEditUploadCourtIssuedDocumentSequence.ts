import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocumentToFormAction } from '../actions/EditUploadCourtIssuedDocument/setDocumentToFormAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoEditUploadCourtIssuedDocument =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    setRedirectUrlAction,
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocumentToFormAction,
    setupCurrentPageAction('EditUploadCourtIssuedDocument'),
  ]);

export const gotoEditUploadCourtIssuedDocumentSequence = [
  gotoEditUploadCourtIssuedDocument,
];
