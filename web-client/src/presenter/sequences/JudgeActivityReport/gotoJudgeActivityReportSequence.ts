import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearJudgeActivityReportResultAction } from '../../actions/JudgeActivityReport/clearJudgeActivityReportResultAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { isLoggedInAction } from '../../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../../actions/redirectToCognitoAction';
import { setJudgeLastNameOnFormAction } from '../../actions/JudgeActivityReport/setJudgeLastNameOnFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

const gotoJudgeActivityReport = [
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  stopShowValidationAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  clearFormAction,
  clearJudgeActivityReportResultAction,
  setJudgeLastNameOnFormAction,
  setupCurrentPageAction('JudgeActivityReport'),
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
