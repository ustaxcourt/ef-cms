import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeTrialSessionAction } from '../actions/TrialSession/closeTrialSessionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const closeTrialSessionSequence = [
  clearModalStateAction,
  clearModalAction,
  setWaitingForResponseAction,
  clearAlertsAction,
  clearScreenMetadataAction,
  closeTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, unsetWaitingForResponseAction],
  },
  clearModalAction,
];
