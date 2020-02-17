import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';

export const gotoPrintablePendingReportForCaseSequence = [
  setCurrentPageAction('Interstitial'),
  getCaseAction,
  setCaseAction,
  setupPropsForPrintablePendingReportAction,
  generatePrintablePendingReportAction,
  setPdfPreviewUrlSequence,
  setTitleForGlobalReportAction,
  setCurrentPageAction('SimplePdfPreviewPage'),
];
