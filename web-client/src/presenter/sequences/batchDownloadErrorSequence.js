import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unset } from 'cerebral/factories';

export const batchDownloadErrorSequence = [
  stopWebSocketConnectionAction,
  unset(state.batchDownloads.zipInProgress),
  setShowModalFactoryAction('FileCompressionErrorModal'),
];
