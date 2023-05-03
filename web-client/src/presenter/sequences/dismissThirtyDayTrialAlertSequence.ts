import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const dismissThirtyDayTrialAlertSequence = showProgressSequenceDecorator(
  [
    clearModalAction,
    dismissThirtyDayAlertFromTrialSessionAction,
    {
      error: [setAlertErrorAction],
      success: [],
    },
  ],
);
