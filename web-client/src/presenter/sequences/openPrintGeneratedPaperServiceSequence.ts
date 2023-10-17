import { generateTrialCalendarPdfUrlAction } from '../actions/TrialSession/generateTrialCalendarPdfUrlAction';
import { gotoPrintTrialCalendarPreviewAction } from '../actions/gotoPrintTrialCalendarPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const openPrintGeneratedPaperServiceSequence =
  showProgressSequenceDecorator([
    generateTrialCalendarPdfUrlAction,
    setPdfPreviewUrlSequence,
    gotoPrintTrialCalendarPreviewAction,
  ]);
