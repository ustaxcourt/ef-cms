import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { clearStatusOrderResponseFormAction } from '@web-client/presenter/actions/clearStatusOrderResponseFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocketEntrySelectedFromMessageAction } from '../actions/setDocketEntrySelectedFromMessageAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoOrderResponseSequence = [
  setupCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntrySelectedFromMessageAction,
  clearPdfPreviewUrlAction,
  clearStatusOrderResponseFormAction,
  setupCurrentPageAction('OrderResponse'),
];
