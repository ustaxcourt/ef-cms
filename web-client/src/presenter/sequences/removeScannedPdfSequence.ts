import { clearModalSequence } from './clearModalSequence';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { removeScannedPdfAction } from '../actions/removeScannedPdfAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForCdsAction } from '../actions/StartCaseInternal/updateOrderForCdsAction';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';

export const removeScannedPdfSequence = [
  removeScannedPdfAction,
  setDocumentUploadModeSequence,
  clearModalSequence,
  getFormValueDocumentAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForCdsAction,
];
