import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { gotoPrintTrialCalendarPreview } from '../actions/gotoPrintTrialCalendarPreview';
import { printTrialCalendarAction } from '../actions/printTrialCalendarAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const printTrialCalendarSequence = [
  setWaitingForResponseAction,
  printTrialCalendarAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintTrialCalendarPreview,
  unsetWaitingForResponseAction,
];
