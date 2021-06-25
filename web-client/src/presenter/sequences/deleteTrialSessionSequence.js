import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteTrialSessionAction } from '../actions/TrialSession/deleteTrialSessionAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';

export const deleteTrialSessionSequence = [
  clearAlertsAction,
  deleteTrialSessionAction,
  {
    error: [],
    success: [navigateToTrialSessionsAction],
  },
  clearModalAction,
];
