import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [getTrialSessionDetailsAction, setTrialSessionDetailsAction],
  },
];
