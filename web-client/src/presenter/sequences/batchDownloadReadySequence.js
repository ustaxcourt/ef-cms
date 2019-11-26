import { displayDownloadLinkAction } from '../actions/batchDownload/displayDownloadLinkAction';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unset } from 'cerebral/factories';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const batchDownloadReadySequence = [
  unset(state.batchDownloads),
  unset(state.zipInProgress),
  unsetWaitingForResponseAction,
  displayDownloadLinkAction,
  stopWebSocketConnectionAction,
];
