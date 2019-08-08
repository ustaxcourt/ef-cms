import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintDocketRecordPreview } from '../actions/gotoPrintDocketRecordPreview';
import { printDocketRecordAction } from '../actions/printDocketRecordAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const printDocketRecordSequence = [
  printDocketRecordAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintDocketRecordPreview,
];
