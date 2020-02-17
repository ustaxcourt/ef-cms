import { displayDownloadLinkAction } from '../actions/batchDownload/displayDownloadLinkAction';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unset } from 'cerebral/factories';

export const batchDownloadReadySequence = [
  displayDownloadLinkAction,
  stopWebSocketConnectionAction,
  unset(state.batchDownloads),
];
