import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';

export const batchDownloadTrialSessionSequence = [
  clearModalAction,
  startWebSocketConnectionAction,
  batchDownloadTrialSessionAction,
  {
    error: [setShowModalAction],
    success: [],
  },
];
