import { clearModalSequence } from './clearModalSequence';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { removeScannedPdfAction } from '../actions/removeScannedPdfAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';

export const removeScannedPdfSequence = [
  removeScannedPdfAction,
  ...setDocumentUploadModeSequence,
  ...clearModalSequence,
  getFormValueDocumentAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForOdsAction,
];
