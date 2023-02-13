import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/BatchDownload/defaultBatchDownloadStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const batchDownloadTrialSessionSequence = [
  clearModalAction,
  defaultBatchDownloadStateAction,
  batchDownloadTrialSessionAction,
  {
    error: [setShowModalAction],
    success: [],
  },
];
