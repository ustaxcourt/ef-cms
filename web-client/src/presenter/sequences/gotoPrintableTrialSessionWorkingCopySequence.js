import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForPrintableTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTitleForPrintableTrialSessionWorkingCopyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { state } from 'cerebral';

// TODOS
// 1. Check if we need to be logged in AND authorized (judge, ca, trial clerks)
// 2. Refactor setTitleForGlobalReportAction to take a dynamic value for header title

const getFormattedTrialSessionDetails = ({ get }) => {
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
  return { formattedTrialSessionDetails };
};

const getFormattedTrialSessionCasesAction = ({ get }) => {
  const { formattedCases } = get(state.trialSessionWorkingCopyHelper) || [];
  console.log('formattedCases***', formattedCases);
  return { formattedCases };
};

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getFormattedTrialSessionDetails,
    getFormattedTrialSessionCasesAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
