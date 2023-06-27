import { clearAlertsAction } from '../actions/clearAlertsAction';
import { sequence } from 'cerebral';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const printPaperServiceForTrialCompleteSequence = sequence([
  clearAlertsAction,
  setCurrentPageAction('TrialSessionDetail'),
]);
