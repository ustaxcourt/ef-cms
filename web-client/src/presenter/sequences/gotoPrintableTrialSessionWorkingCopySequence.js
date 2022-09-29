import { clearModalAction } from '../actions/clearModalAction';
import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getFormattedTrialSessionCasesAction } from '../actions/TrialSessionWorkingCopy/getFormattedTrialSessionCasesAction';
import { getFormattedTrialSessionDetailsAction } from '../actions/TrialSessionWorkingCopy/getFormattedTrialSessionDetailsAction';
import { getTrialSessionWorkingCopyCaseNotesFlagAction } from '../actions/TrialSessionWorkingCopy/getTrialSessionWorkingCopyCaseNotesFlagAction';
import { getTrialSessionWorkingCopyDataAction } from '../actions/TrialSessionWorkingCopy/getTrialSessionWorkingCopyDataAction';
import { preparePrintableFormattedCasesAction } from '../actions/TrialSessionWorkingCopy/preparePrintableFormattedCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    setRedirectUrlAction,
    clearModalAction,
    getFormattedTrialSessionDetailsAction,
    getFormattedTrialSessionCasesAction,
    preparePrintableFormattedCasesAction,
    getTrialSessionWorkingCopyCaseNotesFlagAction,
    getTrialSessionWorkingCopyDataAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportAction('Trial Session Printable Working Copy'),
    setCurrentPageAction('PrintableTrialSessionWorkingCopyPreviewPage'),
  ]);
