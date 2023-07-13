import { clearModalAction } from '../actions/clearModalAction';
import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getFormattedTrialSessionCasesAction } from '../actions/TrialSessionWorkingCopy/getFormattedTrialSessionCasesAction';
import { preparePrintableFormattedCasesAction } from '../actions/TrialSessionWorkingCopy/preparePrintableFormattedCasesAction';
import { prepareUserBasedHeadingAction } from '../actions/TrialSessionWorkingCopy/prepareUserBasedHeadingAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    setRedirectUrlAction,
    clearModalAction,
    getFormattedTrialSessionCasesAction,
    preparePrintableFormattedCasesAction,
    prepareUserBasedHeadingAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setCurrentPageAction('PrintableTrialSessionWorkingCopyPreviewPage'),
  ]);
