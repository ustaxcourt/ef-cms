import { clearCaseDeadlineReportAction } from '../actions/CaseDeadline/clearCaseDeadlineReportAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { parallel } from 'cerebral/factories';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setDefaultCaseDeadlinesReportDatesAction } from '../actions/CaseDeadline/setDefaultCaseDeadlinesReportDatesAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoCaseDeadlineReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  parallel([
    getSetJudgesSequence,
    [
      clearCaseDeadlineReportAction,
      setDefaultCaseDeadlinesReportDatesAction,
      getCaseDeadlinesAction,
      setCaseDeadlinesAction,
    ],
  ]),
  setupCurrentPageAction('CaseDeadlines'),
]);

export const gotoCaseDeadlineReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoCaseDeadlineReport,
    unauthorized: [navigateToLoginSequence],
  },
];
