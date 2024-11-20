import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/navigateToTrialSessionDetailsAction';

export const printPaperServiceForTrialCompleteSequence = [
  clearAlertsAction,
  navigateToTrialSessionDetailsAction,
];
