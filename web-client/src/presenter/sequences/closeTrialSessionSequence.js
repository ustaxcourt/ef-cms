import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeTrialSessionAction } from '../actions/TrialSession/closeTrialSessionAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const closeTrialSessionSequence = [
  clearModalStateAction,
  clearModalAction,
  setWaitingForResponseAction,
  clearAlertsAction,
  clearScreenMetadataAction,
  closeTrialSessionAction,
];
