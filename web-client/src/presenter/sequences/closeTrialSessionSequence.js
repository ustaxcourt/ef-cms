import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const setTrialSessionCalendarSequence = [
  clearModalStateAction,
  clearModalAction,
  setWaitingForResponseAction,
  clearAlertsAction,
  clearScreenMetadataAction,
  // closeTrialSessionAction,
];
