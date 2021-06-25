import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteTrialSessionAction } from '../actions/TrialSession/deleteTrialSessionAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';

export const deleteTrialSessionSequence = [
  clearAlertsAction,
  deleteTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [navigateToTrialSessionsAction],
  },
  clearModalAction,
];
