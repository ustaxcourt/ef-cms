import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/BatchDownload/defaultBatchDownloadStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const batchDownloadDocketEntriesSequence = [
  clearModalAction,
  // defaultBatchDownloadStateAction,
  batchDownloadDocketEntriesAction,
  {
    error: [setShowModalAction],
    success: [],
  },
];
