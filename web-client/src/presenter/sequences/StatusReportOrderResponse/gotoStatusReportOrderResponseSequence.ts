import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/clearStatusReportOrderResponseFormAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDocketEntryIdAction } from '../../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../../actions/setDocketEntrySelectedFromMessageAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { unsetDocumentToEditAction } from '@web-client/presenter/actions/unsetDocumentToEditAction';

export const gotoStatusReportOrderResponseSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  clearPdfPreviewUrlAction,
  clearStatusReportOrderResponseFormAction,
  unsetDocumentToEditAction,
  setupCurrentPageAction('StatusReportOrderResponse'),
] as unknown as (props: {
  docketEntryId: string;
  docketNumber: string;
  parentMessageId?: string;
}) => void;
