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

const transformConsolidatedCasesOnFormattedCasesAction = ({ props }) => {
  let { formattedCases } = props;
  let temporaryFormattedCases = [];

  for (let i = 0; i < formattedCases.length; i++) {
    temporaryFormattedCases.push(formattedCases[i]);
    if (formattedCases[i].leadCase) {
      temporaryFormattedCases = temporaryFormattedCases.concat(
        formattedCases[i].consolidatedCases,
      );
    }
  }
  console.log('temporaryFormattedCases*** ', temporaryFormattedCases);
  formattedCases = temporaryFormattedCases;
  return { formattedCases };
};

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getFormattedTrialSessionDetails,
    getFormattedTrialSessionCasesAction,
    transformConsolidatedCasesOnFormattedCasesAction,
    getNameToDisplay,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
