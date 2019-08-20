import { clearModalSequence } from './clearModalSequence';
import { removeScannedPdfAction } from '../actions/removeScannedPdfAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';

export const removeScannedPdfSequence = [
  removeScannedPdfAction,
  ...setDocumentUploadModeSequence,
  ...clearModalSequence,
];
