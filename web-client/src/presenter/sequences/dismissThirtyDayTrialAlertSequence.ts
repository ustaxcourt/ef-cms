import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
];
