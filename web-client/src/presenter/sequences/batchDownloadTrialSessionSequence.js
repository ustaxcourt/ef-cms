import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupNotificationListenerAction } from '../actions/setupNotificationListenerAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const batchDownloadTrialSessionSequence = [
  setWaitingForResponseAction,
  setupNotificationListenerAction,
  batchDownloadTrialSessionAction,
  unsetWaitingForResponseAction,
];
