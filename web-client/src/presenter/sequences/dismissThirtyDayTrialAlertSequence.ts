import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWaitingTextAction } from '../actions/setWaitingTextAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  setWaitingForResponseAction,
  setWaitingTextAction(
    'Please stay on this page while we process your request.',
  ),
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [
      unsetWaitingForResponseAction,
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
    ],
  },
];
