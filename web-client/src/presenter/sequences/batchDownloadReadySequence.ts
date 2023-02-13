import { displayDownloadLinkAction } from '../actions/BatchDownload/displayDownloadLinkAction';
import { unsetBatchDownloadsAction } from '../actions/unsetBatchDownloadsAction';

export const batchDownloadReadySequence = [
  displayDownloadLinkAction,
  unsetBatchDownloadsAction,
];
