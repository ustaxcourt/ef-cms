import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportFactoryAction } from '../actions/PendingItems/setTitleForGlobalReportFactoryAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintablePendingReportForCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setupPropsForPrintablePendingReportAction,
    generatePrintablePendingReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportFactoryAction('Pending Report'),
    setupCurrentPageAction('SimplePdfPreviewPage'),
  ]);
