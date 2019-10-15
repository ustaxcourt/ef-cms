import { displayDownloadLinkAction } from '../actions/batchDownload/displayDownloadLinkAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const batchDownloadReadySequence = [
  unsetWaitingForResponseAction,
  displayDownloadLinkAction,
  stopWebSocketConnectionAction,
];
