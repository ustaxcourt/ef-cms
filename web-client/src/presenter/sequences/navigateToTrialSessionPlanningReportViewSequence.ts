import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { navigateToTrialSessionPlanningReportViewAction } from '../actions/navigateToTrialSessionPlanningReportViewAction';

export const navigateToTrialSessionPlanningReportSequence = [
  navigateToTrialSessionPlanningReportViewAction,
  clearModalAction,
];
