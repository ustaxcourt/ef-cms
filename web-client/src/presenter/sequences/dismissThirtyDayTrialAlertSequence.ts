import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { sequence } from 'cerebral';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';

export const dismissThirtyDayTrialAlertSequence = sequence([
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [getTrialSessionDetailsAction, setTrialSessionDetailsAction],
  },
]);
