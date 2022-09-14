import { clearModalAction } from '../actions/clearModalAction';
import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getTrialSessionWorkingCopyRedirectUrlAction } from '../actions/TrialSessionWorkingCopy/getTrialSessionWorkingCopyRedirectUrlAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
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

const getTrialSessionWorkingCopyDataAction = ({ get }) => {
  const { filters, sessionNotes } = get(state.trialSessionWorkingCopy);
  return { filters, sessionNotes };
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
    getTrialSessionWorkingCopyRedirectUrlAction,
    setRedirectUrlAction,
    clearModalAction,
    getFormattedTrialSessionDetails,
    getFormattedTrialSessionCasesAction,
    preparePrintableFormattedCasesAction,
    getNameToDisplay,
    getCaseNotesFlagAction,
    getTrialSessionWorkingCopyDataAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForPrintableTrialSessionWorkingCopyAction,
    setCurrentPageAction('PrintableTrialSessionWorkingCopyPreviewPage'),
  ]);
