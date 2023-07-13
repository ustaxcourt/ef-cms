import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportFactoryAction } from '../actions/PendingItems/setTitleForGlobalReportFactoryAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintablePendingReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    generatePrintablePendingReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportFactoryAction('Pending Report'),
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
