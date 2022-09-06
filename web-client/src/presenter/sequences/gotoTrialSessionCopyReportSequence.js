import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { state } from 'cerebral';

// TODOS
// 1. Check if we need to be logged in AND authorized (judge, ca, trialclerks)
// 2. Refactor setTitleForGlobalReportAction to take a dynamic value for header title

const getFormattedTrialSessionDetails = ({ get }) => {
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
  console.log('formattedTrialSessionDetails', formattedTrialSessionDetails);
  return { formattedTrialSessionDetails };
};

const generateTrialSessionCopyReport =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getFormattedTrialSessionDetails,
    generatePrintableTrialSessionCopyReportAction,
    // setPdfPreviewUrlSequence,
    // setTitleForGlobalReportAction,
    // setCurrentPageAction('TrialSessionCopyReport'),
    // setCurrentPageAction('SimplePdfPreviewPage'),
  ]);

export const gotoTrialSessionCopyReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: generateTrialSessionCopyReport,
    unauthorized: [redirectToCognitoAction],
  },
  setPdfPreviewUrlSequence,
];
