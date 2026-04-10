import { generateTrialCalendarPdfUrlAction } from '../actions/TrialSession/generateTrialCalendarPdfUrlAction';
import { gotoPrintPublicSessionCopyPreviewAction } from '../actions/gotoPrintPublicSessionCopyPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const printPublicSessionCopySequence = showProgressSequenceDecorator([
  generateTrialCalendarPdfUrlAction,
  setPdfPreviewUrlSequence,
  gotoPrintPublicSessionCopyPreviewAction,
]);
