import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/clearStatusReportOrderResponseFormAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { getStatusReportOrderResponseDocketNumbersToDisplayAction } from '@web-client/presenter/actions/StatusReportOrderResponse/getStatusReportOrderResponseDocketNumbersToDisplayAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDocketEntryIdAction } from '../../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../../actions/setDocketEntrySelectedFromMessageAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { shouldUnsetParentMessageIdAction } from '@web-client/presenter/actions/shouldUnsetParentMessageIdAction';
import { unsetDocumentToEditAction } from '@web-client/presenter/actions/unsetDocumentToEditAction';
import { unsetParentMessageIdAction } from '@web-client/presenter/actions/unsetParentMessageIdAction';

export const gotoStatusReportOrderResponseSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  clearPdfPreviewUrlAction,
  unsetDocumentToEditAction,
  shouldUnsetParentMessageIdAction,
  {
    no: [],
    yes: [unsetParentMessageIdAction],
  },
  clearStatusReportOrderResponseFormAction,
  getStatusReportOrderResponseDocketNumbersToDisplayAction,
  setupCurrentPageAction('StatusReportOrderResponse'),
] as unknown as (props: {
  docketEntryId: string;
  docketNumber: string;
  parentMessageId?: string;
}) => void;
