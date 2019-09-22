import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintDocketRecordPreview } from '../actions/gotoPrintDocketRecordPreview';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const printDocketRecordSequence = [
  setWaitingForResponseAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintDocketRecordPreview,
  unsetWaitingForResponseAction,
];
