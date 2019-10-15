import { generateTrialCalendarPdfUrlAction } from '../actions/TrialSession/generateTrialCalendarPdfUrlAction';
import { gotoPrintTrialCalendarPreview } from '../actions/gotoPrintTrialCalendarPreview';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const printTrialCalendarSequence = [
  setWaitingForResponseAction,
  generateTrialCalendarPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintTrialCalendarPreview,
  unsetWaitingForResponseAction,
];
