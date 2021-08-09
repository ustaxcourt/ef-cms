import { displayDownloadLinkAction } from '../actions/BatchDownload/displayDownloadLinkAction';
import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';
import { unsetBatchDownloadsAction } from '../actions/unsetBatchDownloadsAction';

export const batchDownloadReadySequence = [
  displayDownloadLinkAction,
  stopWebSocketConnectionAction,
  unsetBatchDownloadsAction,
];
