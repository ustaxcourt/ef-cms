import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';

export const batchDownloadTrialSessionSequence = [
  setWaitingForResponseAction,
  startWebSocketConnectionAction,
  batchDownloadTrialSessionAction,
];
