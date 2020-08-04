import { clearModalSequence } from './clearModalSequence';
import { clearPdfPreviewUrlAction } from '../actions/clearPdfPreviewUrlAction';
import { deleteUploadedPdfAction } from '../actions/deleteUploadedPdfAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';

export const deleteUploadedPdfSequence = [
  deleteUploadedPdfAction,
  clearPdfPreviewUrlAction,
  setDocumentUploadModeSequence,
  clearModalSequence,
  getFormValueDocumentAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForOdsAction,
  setCaseAction,
];
