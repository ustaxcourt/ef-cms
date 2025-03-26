import { clearFormAction } from '../actions/clearFormAction';
// import { clearPDFStampDataAction } from '../actions/StampMotion/clearPDFStampDataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../actions/setDocketEntrySelectedFromMessageAction';
import { setPDFForStampAction } from '../actions/setPDFForStampAction';
// import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '@web-client/presenter/actions/setParentMessageIdAction';
// import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { clearStatusReportOrderFormAction } from '../actions/StatusReportOrder/clearStatusReportOrderFormAction';

export const goToOrderResponseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocketEntrySelectedFromMessageAction,
    setParentMessageIdAction,
    // TODO 10586: Clean up commented code at the end
    // clearPDFStampDataAction,
    clearFormAction,
    // setSignatureNameForPdfSigningAction,
    setPDFForStampAction,
    // setPDFPageForSigningAction,
    clearStatusReportOrderFormAction,
    setupCurrentPageAction('OrderResponse'), // TODO 10586: This is where we set the html page
  ]);
