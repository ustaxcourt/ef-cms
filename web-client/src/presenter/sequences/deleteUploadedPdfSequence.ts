import { clearModalSequence } from './clearModalSequence';
import { clearPdfPreviewUrlAction } from '../actions/clearPdfPreviewUrlAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { removePdfFromCaseAction } from '../actions/removePdfFromCaseAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForCdsAction } from '../actions/StartCaseInternal/updateOrderForCdsAction';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';

export const deleteUploadedPdfSequence = [
  removePdfFromCaseAction,
  clearPdfPreviewUrlAction,
  setDocumentUploadModeSequence,
  clearModalSequence,
  getFormValueDocumentAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForCdsAction,
];
