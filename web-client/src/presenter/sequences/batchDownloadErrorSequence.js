import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unset } from 'cerebral/factories';

import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const batchDownloadErrorSequence = [
  stopWebSocketConnectionAction,
  unset(state.batchDownload.zipInProgress),
  setShowModalFactoryAction('FileCompressionErrorModal'),
];
