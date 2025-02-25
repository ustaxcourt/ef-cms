import { addPrintableDocketRecordCheckAction } from '@web-client/presenter/actions/addPrintableDocketRecordCheckAction';
import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { generateDocketRecordPdfUrlAction } from '@web-client/presenter/actions/generateDocketRecordPdfUrlAction';
import { resetBatchDownloadProgressAction } from '@web-client/presenter/actions/BatchDownload/resetBatchDownloadProgressAction';
import { setBatchDownloadProgressAction } from '@web-client/presenter/actions/BatchDownload/setBatchDownloadProgressAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const batchDownloadDocketEntriesSequence = [
  clearModalAction,
  addPrintableDocketRecordCheckAction,
  {
    no: [],
    yes: [generateDocketRecordPdfUrlAction],
  },
  setBatchDownloadProgressAction,
  batchDownloadDocketEntriesAction,
  {
    error: [resetBatchDownloadProgressAction, setShowModalAction],
    success: [],
  },
] as unknown as (props: {
  isAddPrintableDocketRecordSelected: boolean;
}) => void;
