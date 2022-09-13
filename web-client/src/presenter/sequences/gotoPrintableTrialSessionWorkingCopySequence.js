import { clearModalAction } from '../actions/clearModalAction';
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

const getTrialSessionWorkingCopyFiltersAction = ({ get }) => {
  const filters = get(state.trialSessionWorkingCopy.filters);
  return { filters };
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

const getCaseNotesFlagAction = ({ get }) => {
  const caseNotesFlag = get(state.modal.caseNotesFlag);
  return { caseNotesFlag };
};

const preparePrintableFormattedCasesAction = ({ props }) => {
  let { formattedCases } = props;
  let temporaryFormattedCases = [];

  formattedCases.map(formattedCase => {
    temporaryFormattedCases.push(formattedCase);
    if (formattedCase.leadCase) {
      temporaryFormattedCases = temporaryFormattedCases.concat(
        formattedCase.consolidatedCases,
      );
    }
  });

  formattedCases = temporaryFormattedCases;
  return { formattedCases };
};

export const gotoPrintableTrialSessionWorkingCopySequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    clearModalAction,
    getFormattedTrialSessionDetails,
    getFormattedTrialSessionCasesAction,
    preparePrintableFormattedCasesAction,
    getNameToDisplay,
    getCaseNotesFlagAction,
    getTrialSessionWorkingCopyFiltersAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);
