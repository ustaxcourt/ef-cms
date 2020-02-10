import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintDocketRecordPreviewAction } from '../actions/gotoPrintDocketRecordPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const printDocketRecordSequence = showProgressSequenceDecorator([
  generateDocketRecordPdfUrlAction,
  setPdfPreviewUrlSequence,
  gotoPrintDocketRecordPreviewAction,
]);
