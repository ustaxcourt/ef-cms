import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintablePendingReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    generatePrintablePendingReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
