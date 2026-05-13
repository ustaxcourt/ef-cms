import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setDismissedAlertForNottAction } from '../actions/TrialSession/setDismissedAlertForNottAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [setDismissedAlertForNottAction],
  },
];
