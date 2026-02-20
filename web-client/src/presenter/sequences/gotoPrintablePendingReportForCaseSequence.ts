import { generatePrintablePendingReportAction } from '../actions/PendingItems/generatePrintablePendingReportAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportFactoryAction } from '../actions/PendingItems/setTitleForGlobalReportFactoryAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupPropsForPrintablePendingReportAction } from '../actions/PendingItems/setupPropsForPrintablePendingReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintablePendingReportForCaseSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    getCaseMetadataAction,
    setCaseMetadataAction,
    setupPropsForPrintablePendingReportAction,
    generatePrintablePendingReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportFactoryAction('Pending Report'),
    setupCurrentPageAction('SimplePdfPreviewPage'),
  ]);
