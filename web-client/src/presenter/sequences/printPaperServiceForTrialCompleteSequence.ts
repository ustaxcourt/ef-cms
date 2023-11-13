import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToTrialSessionDetailAction } from '@web-client/presenter/actions/TrialSession/navigateToTrialSessionDetailAction';

export const printPaperServiceForTrialCompleteSequence = [
  clearAlertsAction,
  navigateToTrialSessionDetailAction,
];
