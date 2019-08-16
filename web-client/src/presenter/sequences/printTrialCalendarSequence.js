import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintTrialCalendarPreview } from '../actions/gotoPrintTrialCalendarPreview';
import { printTrialCalendarAction } from '../actions/printTrialCalendarAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const printTrialCalendarSequence = [
  printTrialCalendarAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintTrialCalendarPreview,
];
