import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { grantDenyMotionPdfPreviewSequence } from '@web-client/presenter/sequences/GrantDenyMotion/grantDenyMotionPdfPreviewSequence';
import { isEditOrderResponseAction } from '@web-client/presenter/actions/StatusReportOrder/isEditOrderResponseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setDocketEntryIdAction } from '@web-client/presenter/actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '@web-client/presenter/actions/setDocketEntrySelectedFromMessageAction';
import { setDocumentToEditAction } from '@web-client/presenter/actions/setDocumentToEditAction';
import { setEditGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/setEditGrantDenyMotionFormAction';
import { setParentMessageIdAction } from '@web-client/presenter/actions/setParentMessageIdAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { setupGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/setupGrantDenyMotionFormAction';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '@web-client/presenter/actions/unsetDocumentToEditAction';

export const gotoGrantDenyMotionSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setParentMessageIdAction,
    clearPdfPreviewUrlAction,
    clearFormAction,
    stopShowValidationAction,
    isEditOrderResponseAction,
    {
      create: [
        setDocketEntryIdAction,
        setDocketEntrySelectedFromMessageAction,
        setupGrantDenyMotionFormAction,
        unsetDocumentToEditAction,
      ],
      edit: [
        setDocumentToEditAction,
        setEditGrantDenyMotionFormAction,
        grantDenyMotionPdfPreviewSequence,
      ],
    },
    setupCurrentPageAction('GrantDenyMotion'),
  ]) as unknown as (props: {
    docketEntryIdToEdit?: string;
    docketNumber: string;
    docketEntryId?: string;
    isEditing?: boolean;
    parentMessageId?: string;
  }) => void;
