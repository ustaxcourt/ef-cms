import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupNotificationListenerAction } from '../actions/setupNotificationListenerAction';

export const batchDownloadTrialSessionSequence = [
  setWaitingForResponseAction,
  setupNotificationListenerAction,
  batchDownloadTrialSessionAction,
];
