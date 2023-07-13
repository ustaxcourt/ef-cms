import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearJudgeActivityReportResultAction } from '../../actions/JudgeActivityReport/clearJudgeActivityReportResultAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { isLoggedInAction } from '../../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { setJudgeLastNameOnFormAction } from '../../actions/JudgeActivityReport/setJudgeLastNameOnFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

const gotoJudgeActivityReport = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  stopShowValidationAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  clearFormAction,
  clearJudgeActivityReportResultAction,
  setJudgeLastNameOnFormAction,
  setCurrentPageAction('JudgeActivityReport'),
];

export const gotoJudgeActivityReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(
      gotoJudgeActivityReport,
    ),
    unauthorized: [redirectToCognitoAction],
  },
];
