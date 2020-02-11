import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const gotoPrintableDocketRecordSequence = showProgressSequenceDecorator([
  getCaseAction,
  setCaseAction,
  generateDocketRecordPdfUrlAction,
  setPdfPreviewUrlSequence,
  setCurrentPageAction('PrintableDocketRecord'),
]);
