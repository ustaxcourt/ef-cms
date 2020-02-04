import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';

export const gotoPrintablePendingReportSequence = [
  setCurrentPageAction('Interstitial'),
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  setTitleForGlobalReportAction,
  setCurrentPageAction('SimplePdfPreviewPage'),
];
