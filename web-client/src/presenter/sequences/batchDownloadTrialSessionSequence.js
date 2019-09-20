import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setupNotificationListenerAction } from '../actions/setupNotificationListenerAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const batchDownloadTrialSessionSequence = [
  setFormSubmittingAction,
  setupNotificationListenerAction,
  batchDownloadTrialSessionAction,
  unsetFormSubmittingAction,
];
