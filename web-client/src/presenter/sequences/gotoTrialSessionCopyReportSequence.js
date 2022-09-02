import { generateTrialSessionCopyReportAction } from '../actions/TrialSessionWorkingCopy/generateTrialSessionCopyReportAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const generateTrialSessionCopyReport =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('TrialSessionCopyReport'),
    generateTrialSessionCopyReportAction,
  ]);

export const gotoTrialSessionCopyReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: generateTrialSessionCopyReport,
    unauthorized: [redirectToCognitoAction],
  },
];
