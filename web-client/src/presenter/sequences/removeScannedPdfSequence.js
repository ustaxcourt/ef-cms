import { clearModalSequence } from './clearModalSequence';
import { removeScannedPdfAction } from '../actions/removeScannedPdfAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';

export const removeScannedPdfSequence = [
  removeScannedPdfAction,
  ...setDocumentUploadModeSequence,
  ...clearModalSequence,
  updateOrderForDesignatingPlaceOfTrialAction,
  updateOrderForOdsAction,
];
