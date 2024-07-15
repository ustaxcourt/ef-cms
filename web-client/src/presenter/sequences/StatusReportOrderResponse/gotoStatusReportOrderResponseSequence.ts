import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/clearStatusReportOrderResponseFormAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getStatusReportOrderResponseDocketNumbersToDisplayAction } from '@web-client/presenter/actions/StatusReportOrderResponse/getStatusReportOrderResponseDocketNumbersToDisplayAction';
import { isEditStatusReportOrderResponseAction } from '@web-client/presenter/actions/StatusReportOrderResponse/isEditStatusReportOrderResponseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDocketEntryIdAction } from '../../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../../actions/setDocketEntrySelectedFromMessageAction';
import { setDocumentToEditAction } from '@web-client/presenter/actions/setDocumentToEditAction';
import { setEditStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setEditStatusReportOrderResponseFormAction';
import { setRedirectUrlAction } from '@web-client/presenter/actions/setRedirectUrlAction';
import { setStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setStatusReportOrderResponseFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { shouldUnsetParentMessageIdAction } from '@web-client/presenter/actions/shouldUnsetParentMessageIdAction';
import { statusReportOrderResponsePdfPreviewSequence } from '@web-client/presenter/sequences/StatusReportOrderResponse/statusReportOrderResponsePdfPreviewSequence';
import { unsetDocumentToEditAction } from '@web-client/presenter/actions/unsetDocumentToEditAction';
import { unsetParentMessageIdAction } from '@web-client/presenter/actions/unsetParentMessageIdAction';

export const gotoStatusReportOrderResponseSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  setRedirectUrlAction,
  isEditStatusReportOrderResponseAction,
  {
    create: [
      setStatusReportOrderResponseFormAction,
      unsetDocumentToEditAction,
      clearPdfPreviewUrlAction,
      clearStatusReportOrderResponseFormAction,
    ],
    edit: [
      setDocumentToEditAction,
      setStatusReportOrderResponseFormAction,
      setEditStatusReportOrderResponseFormAction,
      statusReportOrderResponsePdfPreviewSequence,
    ],
  },
  shouldUnsetParentMessageIdAction,
  {
    no: [],
    yes: [unsetParentMessageIdAction],
  },
  getStatusReportOrderResponseDocketNumbersToDisplayAction,
  setupCurrentPageAction('StatusReportOrderResponse'),
] as unknown as (props: {
  docketEntryId: string;
  docketNumber: string;
  parentMessageId?: string;
}) => void;
