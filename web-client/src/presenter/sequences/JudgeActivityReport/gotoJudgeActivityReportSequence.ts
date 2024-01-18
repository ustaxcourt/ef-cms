import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearJudgeActivityReportStatisticsDataAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsDataAction';
import { clearJudgeActivityReportStatisticsFiltersAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsFiltersAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { getJudgeForCurrentUserAction } from '@web-client/presenter/actions/getJudgeForCurrentUserAction';
import { getPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesForCurrentJudgeAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { getUsersInSectionAction } from '../../actions/getUsersInSectionAction';
import { parallel } from 'cerebral';
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
  clearJudgeActivityReportStatisticsDataAction,
  clearJudgeActivityReportStatisticsFiltersAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  setDefaultJudgeNameBasedOnUserAction,
  getUsersInSectionAction({ section: 'judge' }),
  setAllAndCurrentJudgesAction,
  setupCurrentPageAction('JudgeActivityReport'),
  parallel([
    [getSubmittedAndCavCasesByJudgeAction],
    [getPendingMotionDocketEntriesForCurrentJudgeAction],
  ]),
  setCavAndSubmittedCasesAction,
  setPendingMotionDocketEntriesForCurrentJudgeAction,
];

export const gotoJudgeActivityReportSequence = [
  startWebSocketConnectionSequenceDecorator(gotoJudgeActivityReport),
];
