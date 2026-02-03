import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFStampDataAction } from '../actions/StampMotion/clearPDFStampDataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../actions/setDocketEntrySelectedFromMessageAction';
import { setPDFForStampAction } from '../actions/setPDFForStampAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '@web-client/presenter/actions/setParentMessageIdAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { getDocumentStorageIdAction } from '../actions/DocketEntry/getDocumentStorageIdAction';

export const goToApplyStampSequence = startWebSocketConnectionSequenceDecorator(
  [
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocketEntrySelectedFromMessageAction,
    setParentMessageIdAction,
    clearPDFStampDataAction,
    clearFormAction,
    setSignatureNameForPdfSigningAction,
    getDocumentStorageIdAction,
    setPDFForStampAction,
    setPDFPageForSigningAction,
    setupCurrentPageAction('ApplyStamp'),
  ],
);
