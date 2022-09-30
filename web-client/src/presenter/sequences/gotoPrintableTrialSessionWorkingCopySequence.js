import { clearModalAction } from '../actions/clearModalAction';
import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getFormattedTrialSessionCasesAction } from '../actions/TrialSessionWorkingCopy/getFormattedTrialSessionCasesAction';
import { preparePrintableFormattedCasesAction } from '../actions/TrialSessionWorkingCopy/preparePrintableFormattedCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setTitleForGlobalReportFactoryAction } from '../actions/PendingItems/setTitleForGlobalReportFactoryAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    setRedirectUrlAction,
    clearModalAction,
    getFormattedTrialSessionCasesAction,
    preparePrintableFormattedCasesAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportFactoryAction(
      'Trial Session Printable Working Copy',
    ),
    setCurrentPageAction('PrintableTrialSessionWorkingCopyPreviewPage'),
  ]);
