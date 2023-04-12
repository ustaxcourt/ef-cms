import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearFormAction } from '../../actions/clearFormAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { isLoggedInAction } from '../../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setJudgeNameForActivityReportAction } from '../../actions/JudgeActivityReport/setJudgeNameForActivityReportAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

const gotoJudgeActivityReport = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  stopShowValidationAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  clearFormAction,
  setJudgeNameForActivityReportAction,
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
