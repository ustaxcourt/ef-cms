import { displayDownloadLinkAction } from '../actions/batchDownload/displayDownloadLinkAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetBatchDownloadsAction } from '../actions/unsetBatchDownloadsAction';

export const batchDownloadReadySequence = [
  displayDownloadLinkAction,
  stopWebSocketConnectionAction,
  unsetBatchDownloadsAction,
];
