import { generateTrialCalendarPdfUrlAction } from '../actions/TrialSession/generateTrialCalendarPdfUrlAction';
import { gotoPrintTrialCalendarPreviewAction } from '../actions/gotoPrintTrialCalendarPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const printTrialCalendarSequence = [
  setWaitingForResponseAction,
  generateTrialCalendarPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  gotoPrintTrialCalendarPreviewAction,
  unsetWaitingForResponseAction,
];
