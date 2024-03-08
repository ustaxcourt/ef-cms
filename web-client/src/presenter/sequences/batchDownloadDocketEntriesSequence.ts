import { addPrintableDocketRecordCheckAction } from '@web-client/presenter/actions/addPrintableDocketRecordCheckAction';
import { batchDownloadDocketEntriesAction } from '@web-client/presenter/actions/batchDownloadDocketEntriesAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/BatchDownload/defaultBatchDownloadStateAction';
import { generateDocketRecordPdfUrlAction } from '@web-client/presenter/actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { getCaseAssociationAction } from '@web-client/presenter/actions/getCaseAssociationAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';
import { setPdfPreviewUrlSequence } from '@web-client/presenter/sequences/setPdfPreviewUrlSequence';
import { setShowModalAction } from '../actions/setShowModalAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';

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
