import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { getJudgeForCurrentUserAction } from '@web-client/presenter/actions/getJudgeForCurrentUserAction';
import { getPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesForCurrentJudgeAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { getUsersInSectionAction } from '../../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../../actions/redirectToCognitoAction';
import { resetJudgeActivityReportStateAction } from '../../actions/resetJudgeActivityReportStateAction';
import { setAllAndCurrentJudgesAction } from '../../actions/setAllAndCurrentJudgesAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { setDefaultJudgeNameBasedOnUserAction } from '../../actions/JudgeActivityReport/setDefaultJudgeNameBasedOnUserAction';
import { setJudgeUserAction } from '@web-client/presenter/actions/setJudgeUserAction';
import { setPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/setPendingMotionDocketEntriesForCurrentJudgeAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

const gotoJudgeActivityReport = [
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  stopShowValidationAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  resetJudgeActivityReportStateAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  setDefaultJudgeNameBasedOnUserAction,
  getUsersInSectionAction({ section: 'judge' }),
  setAllAndCurrentJudgesAction,
  setupCurrentPageAction('JudgeActivityReport'),
  getSubmittedAndCavCasesByJudgeAction,
  setCavAndSubmittedCasesAction,
  getPendingMotionDocketEntriesForCurrentJudgeAction,
  setPendingMotionDocketEntriesForCurrentJudgeAction,
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
