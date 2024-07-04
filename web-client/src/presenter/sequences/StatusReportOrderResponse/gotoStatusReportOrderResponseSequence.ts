import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/clearStatusReportOrderResponseFormAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setDocketEntryIdAction } from '../../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../../actions/setDocketEntrySelectedFromMessageAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoStatusReportOrderResponseSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  clearPdfPreviewUrlAction,
  clearStatusReportOrderResponseFormAction,
  setupCurrentPageAction('StatusReportOrderResponse'),
];
