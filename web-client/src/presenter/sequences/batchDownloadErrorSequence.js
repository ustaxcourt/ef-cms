import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';
import { unsetBatchDownloadsZipInProgessAction } from '../actions/unsetBatchDownloadsZipInProgessAction';

export const batchDownloadErrorSequence = [
  stopWebSocketConnectionAction,
  unsetBatchDownloadsZipInProgessAction,
  setShowModalFactoryAction('FileCompressionErrorModal'),
];
