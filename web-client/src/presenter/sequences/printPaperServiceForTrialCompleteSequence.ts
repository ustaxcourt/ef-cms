import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToTrialSessionDetailAction } from '@web-client/presenter/actions/TrialSession/navigateToTrialSessionDetailAction';
import { sequence } from 'cerebral';

export const printPaperServiceForTrialCompleteSequence = sequence([
  clearAlertsAction,
  navigateToTrialSessionDetailAction,
]);
