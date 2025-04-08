import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setDocketEntryIdAction } from '@web-client/presenter/actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '@web-client/presenter/actions/setDocketEntrySelectedFromMessageAction';
import { setParentMessageIdAction } from '@web-client/presenter/actions/setParentMessageIdAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';
import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { setupOrderResponseFormAction } from '@web-client/presenter/actions/setupOrderResponseFormAction';
import { isEditOrderResponseAction } from '@web-client/presenter/actions/StatusReportOrder/isEditOrderResponseAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setEditMotionOrderResponseFormAction } from '@web-client/presenter/actions/MotionOrderResponse/setEditMotionOrderResponseFormAction';
import { motionOrderResponsePdfPreviewSequence } from '@web-client/presenter/sequences/MotionOrderResponse/motionOrderResponsePdfPreviewSequence';

export const goToOrderResponseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setParentMessageIdAction,
    clearPdfPreviewUrlAction,
    clearFormAction,
    isEditOrderResponseAction,
    {
      create: [
        setDocketEntryIdAction,
        setDocketEntrySelectedFromMessageAction,
        setupOrderResponseFormAction,
        unsetDocumentToEditAction,
      ],
      edit: [
        setDocumentToEditAction,
        setEditMotionOrderResponseFormAction,
        motionOrderResponsePdfPreviewSequence,
      ],
    },
    setupCurrentPageAction('OrderResponse'),
  ]) as unknown as (props: {
    docketEntryIdToEdit?: string;
    docketNumber: string;
    docketEntryId?: string;
    isEditing?: boolean;
    parentMessageId?: string;
  }) => void;
