import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportFactoryAction } from '../actions/PendingItems/setTitleForGlobalReportFactoryAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintablePendingReportForCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getCaseAction,
    setCaseAction,
    setupPropsForPrintablePendingReportAction,
    generatePrintablePendingReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportFactoryAction('Pending Report'),
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
