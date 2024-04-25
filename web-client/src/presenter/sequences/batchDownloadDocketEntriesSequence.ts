import { addPrintableDocketRecordCheckAction } from '@web-client/presenter/actions/addPrintableDocketRecordCheckAction';
import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { generateDocketRecordPdfUrlAction } from '@web-client/presenter/actions/generateDocketRecordPdfUrlAction';
import { setShowModalAction } from '../actions/setShowModalAction';

export const batchDownloadDocketEntriesSequence = [
  clearModalAction,
  addPrintableDocketRecordCheckAction,
  {
    no: [],
    yes: [generateDocketRecordPdfUrlAction],
  },
  batchDownloadDocketEntriesAction,
  {
    error: [setShowModalAction],
    success: [],
  },
] as unknown as (props: {
  isAddPrintableDocketRecordSelected: boolean;
}) => void;
