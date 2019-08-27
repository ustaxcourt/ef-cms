import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintDocketRecordPreview } from '../actions/gotoPrintDocketRecordPreview';
import { printDocketRecordAction } from '../actions/printDocketRecordAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const printDocketRecordSequence = [
  setFormSubmittingAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintDocketRecordPreview,
  unsetFormSubmittingAction,
];
