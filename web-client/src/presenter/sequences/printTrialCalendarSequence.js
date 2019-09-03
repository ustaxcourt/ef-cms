import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintTrialCalendarPreview } from '../actions/gotoPrintTrialCalendarPreview';
import { printTrialCalendarAction } from '../actions/printTrialCalendarAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const printTrialCalendarSequence = [
  setFormSubmittingAction,
  printTrialCalendarAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintTrialCalendarPreview,
  unsetFormSubmittingAction,
];
