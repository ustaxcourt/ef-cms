import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';

export const batchDownloadTrialSessionSequence = [
  startWebSocketConnectionAction,
  batchDownloadTrialSessionAction,
];
