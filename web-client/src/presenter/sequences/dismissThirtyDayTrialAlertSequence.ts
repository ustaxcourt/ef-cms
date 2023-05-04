import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWaitingTextAction } from '../actions/setWaitingTextAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  setWaitingForResponseAction,
  setWaitingTextAction(
    'Please stay on this page while we process your request.',
  ),
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [],
  },
];
