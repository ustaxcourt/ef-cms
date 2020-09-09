import { clearModalSequence } from './clearModalSequence';
import { clearPdfPreviewUrlAction } from '../actions/clearPdfPreviewUrlAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { removePdfFromCaseAction } from '../actions/removePdfFromCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';

export const deleteUploadedPdfSequence = [
  removePdfFromCaseAction,
  clearPdfPreviewUrlAction,
  setDocumentUploadModeSequence,
  clearModalSequence,
  getFormValueDocumentAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForOdsAction,
  setCaseOnFormAction,
];
