import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForPrintableTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTitleForPrintableTrialSessionWorkingCopyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { state } from 'cerebral';

// TODOS
// 1. check if formattedCases and formattedTrialSessionDetails are in state
//    - if not, redirect back to Session Copy
// 2. Make more resilient
//    -

const getFormattedTrialSessionDetails = ({ get }) => {
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
  return { formattedTrialSessionDetails };
};

const getFormattedTrialSessionCasesAction = ({ get }) => {
  const { formattedCases } = get(state.trialSessionWorkingCopyHelper) || [];
  console.log('formattedCases***', formattedCases);
  return { formattedCases };
};

const getNameToDisplay = ({ get }) => {
  const { nameToDisplay } = get(state.trialSessionHeaderHelper) || [];
  return { nameToDisplay };
};

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getFormattedTrialSessionDetails,
    getFormattedTrialSessionCasesAction,
    getNameToDisplay,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
