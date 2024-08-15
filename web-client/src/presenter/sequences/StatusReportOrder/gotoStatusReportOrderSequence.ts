import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/clearStatusReportOrderFormAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getStatusReportOrderDocketNumbersToDisplayAction } from '@web-client/presenter/actions/StatusReportOrder/getStatusReportOrderDocketNumbersToDisplayAction';
import { isEditStatusReportOrderAction } from '@web-client/presenter/actions/StatusReportOrder/isEditStatusReportOrderAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDocketEntryIdAction } from '../../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../../actions/setDocketEntrySelectedFromMessageAction';
import { setDocumentToEditAction } from '@web-client/presenter/actions/setDocumentToEditAction';
import { setEditStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/setEditStatusReportOrderFormAction';
import { setRedirectUrlAction } from '@web-client/presenter/actions/setRedirectUrlAction';
import { setStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/setStatusReportOrderFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { shouldUnsetParentMessageIdAction } from '@web-client/presenter/actions/shouldUnsetParentMessageIdAction';
import { statusReportOrderPdfPreviewSequence } from '@web-client/presenter/sequences/StatusReportOrder/statusReportOrderPdfPreviewSequence';
import { unsetDocumentToEditAction } from '@web-client/presenter/actions/unsetDocumentToEditAction';
import { unsetParentMessageIdAction } from '@web-client/presenter/actions/unsetParentMessageIdAction';

export const gotoStatusReportOrderSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  setRedirectUrlAction,
  isEditStatusReportOrderAction,
  {
    create: [
      setStatusReportOrderFormAction,
      unsetDocumentToEditAction,
      clearPdfPreviewUrlAction,
      clearStatusReportOrderFormAction,
    ],
    edit: [
      setDocumentToEditAction,
      setStatusReportOrderFormAction,
      setEditStatusReportOrderFormAction,
      statusReportOrderPdfPreviewSequence,
    ],
  },
  shouldUnsetParentMessageIdAction,
  {
    no: [],
    yes: [unsetParentMessageIdAction],
  },
  getStatusReportOrderDocketNumbersToDisplayAction,
  setupCurrentPageAction('StatusReportOrder'),
] as unknown as (props: {
  docketEntryId: string;
  docketNumber: string;
  parentMessageId?: string;
}) => void;
