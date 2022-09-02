import { generatePrintableTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generatePrintableTrialSessionCopyReportAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTitleForGlobalReportAction } from '../actions/PendingItems/setTitleForGlobalReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

// TODOS
// 1. Check if we need to be logged in AND authorized (judge, ca, trialclerks)
// 2. Refactor setTitleForGlobalReportAction to take a dynamic value for header title

/// figure out another way to get trialsessionid
export const getTrialSessionId = ({ get, state }) => {
  const trialSessionId = 'a1b04943-8ea8-422b-8990-dec3ca644c83';
  // console.log('trialSessionId', trialSessionId);s

  return trialSessionId;
};

const generateTrialSessionCopyReport =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    getTrialSessionId,
    getTrialSessionDetailsAction,
    generatePrintableTrialSessionCopyReportAction,
    setPdfPreviewUrlSequence,
    setTitleForGlobalReportAction,
    // setCurrentPageAction('TrialSessionCopyReport'),
    setCurrentPageAction('SimplePdfPreviewPage'),
  ]);

export const gotoTrialSessionCopyReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: generateTrialSessionCopyReport,
    unauthorized: [redirectToCognitoAction],
  },
  setPdfPreviewUrlSequence,
];
