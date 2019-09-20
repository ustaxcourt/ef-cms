import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { destroyNotificationListenerAction } from '../actions/destroyNotificationListenerAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setupNotificationListenerAction } from '../actions/setupNotificationListenerAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const batchDownloadTrialSessionSequence = [
  setFormSubmittingAction,
  setupNotificationListenerAction,
  batchDownloadTrialSessionAction,
  destroyNotificationListenerAction,
  unsetFormSubmittingAction,
];
