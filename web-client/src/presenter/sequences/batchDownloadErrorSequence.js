import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetBatchDownloadsZipInProgessAction } from '../actions/unsetBatchDownloadsZipInProgessAction';

export const batchDownloadErrorSequence = [
  unsetBatchDownloadsZipInProgessAction,
  setShowModalFactoryAction('FileCompressionErrorModal'),
];
