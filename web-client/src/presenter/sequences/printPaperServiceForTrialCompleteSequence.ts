import { clearAlertsAction } from '../actions/clearAlertsAction';
import { sequence } from 'cerebral';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const printPaperServiceForTrialCompleteSequence = sequence([
  clearAlertsAction,
  setupCurrentPageAction('TrialSessionDetail'),
]);
