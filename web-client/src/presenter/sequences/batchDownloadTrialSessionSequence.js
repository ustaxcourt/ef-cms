import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/batchDownload/defaultBatchDownloadStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';

export const batchDownloadTrialSessionSequence = [
  clearModalAction,
  startWebSocketConnectionAction,
  defaultBatchDownloadStateAction,
  batchDownloadTrialSessionAction,
  {
    error: [setShowModalAction],
    // success: [],
  },
];
