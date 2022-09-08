import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForPrintableTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTitleForPrintableTrialSessionWorkingCopyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

// TODOS
// 1. Check if we need to be logged in AND authorized (judge, ca, trial clerks)
// 2. Refactor setTitleForGlobalReportAction to take a dynamic value for header title

// const getFormattedTrialSessionDetails = ({ get }) => {
//   const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
//   return { formattedTrialSessionDetails };
// };

export const gotoPrintableTrialSessionWorkingcCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
