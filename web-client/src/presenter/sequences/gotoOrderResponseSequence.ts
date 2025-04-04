import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
// import { clearPDFStampDataAction } from '../actions/StampMotion/clearPDFStampDataAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setDocketEntryIdAction } from '@web-client/presenter/actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '@web-client/presenter/actions/setDocketEntrySelectedFromMessageAction';
// import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '@web-client/presenter/actions/setParentMessageIdAction';
// import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';
import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { setupOrderResponseFormAction } from '@web-client/presenter/actions/setupOrderResponseFormAction';
import { isEditMotionOrderResponseAction } from '@web-client/presenter/actions/MotionOrderResponse/isEditMotionOrderResponseAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditStatusReportOrderFormAction } from '../actions/StatusReportOrder/setEditStatusReportOrderFormAction';

export const goToOrderResponseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setDocketEntryIdAction,
    setDocketEntrySelectedFromMessageAction,
    setParentMessageIdAction,
    // TODO 10586: Clean up commented code at the end
    clearPdfPreviewUrlAction,
    clearFormAction,
    isEditMotionOrderResponseAction,
    {
      create: [setupOrderResponseFormAction, unsetDocumentToEditAction],
      edit: [setDocumentToEditAction, setEditStatusReportOrderFormAction],
    },
    // clearStatusReportOrderFormAction,
    setupCurrentPageAction('OrderResponse'), // TODO 10586: This is where we set the html page
  ]);
