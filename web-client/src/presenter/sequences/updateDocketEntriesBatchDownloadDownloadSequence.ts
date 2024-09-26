import { mergeDocketEntriesBatchesAction } from '@web-client/presenter/actions/BatchDownload/DocketEntries/mergeDocketEntriesBatchesAction';
import { singleDocketEntriesBatchCompleteAction } from '@web-client/presenter/actions/BatchDownload/DocketEntries/singleDocketEntriesBatchCompleteAction';
import { unsetBatchDownloadsZipInProgessAction } from '@web-client/presenter/actions/unsetBatchDownloadsZipInProgessAction';

export const updateDocketEntriesBatchDownloadDownloadSequence = [
  singleDocketEntriesBatchCompleteAction,
  {
    batchComplete: [
      mergeDocketEntriesBatchesAction,
      unsetBatchDownloadsZipInProgessAction,
    ],
    batchIncomplete: [],
  },
];
