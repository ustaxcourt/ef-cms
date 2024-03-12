import { addPrintableDocketRecordCheckAction } from '@web-client/presenter/actions/addPrintableDocketRecordCheckAction';
import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/BatchDownload/defaultBatchDownloadStateAction';
import { generateDocketRecordPdfUrlAction } from '@web-client/presenter/actions/generateDocketRecordPdfUrlAction';
import { setPdfPreviewUrlSequence } from '@web-client/presenter/sequences/setPdfPreviewUrlSequence';
import { setShowModalAction } from '../actions/setShowModalAction';

export const batchDownloadDocketEntriesSequence = [
  clearModalAction,
  addPrintableDocketRecordCheckAction,
  {
    no: [],
    yes: [generateDocketRecordPdfUrlAction],
  },
  // defaultBatchDownloadStateAction,
  batchDownloadDocketEntriesAction,
  {
    error: [setShowModalAction],
    success: [],
  },
] as unknown as (props: {
  isAddPrintableDocketRecordSelected: boolean;
}) => void;
