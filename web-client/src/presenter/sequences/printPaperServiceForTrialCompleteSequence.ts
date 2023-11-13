import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const printPaperServiceForTrialCompleteSequence = [
  clearAlertsAction,
  setupCurrentPageAction('TrialSessionDetail'),
];
