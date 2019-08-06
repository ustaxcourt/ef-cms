import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { generatePdfFromScanSessionAction } from '../actions/generatePdfFromScanSessionAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { resetScanSessionAction } from '../actions/resetScanSessionAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateFormValueSequence } from './updateFormValueSequence';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const generatePdfFromScanSessionSequence = [
  generatePdfFromScanSessionAction,
  validateFileSizeAction,
  {
    invalid: [set(state.submitting, false), set(state.isScanning, false)],
    valid: [
      getFormValueDocumentAction,
      ...updateFormValueSequence,
      getFormValueDocumentSizeAction,
      ...updateFormValueSequence,
      ...validatePetitionFromPaperSequence,
      ...selectDocumentForPreviewSequence,
      ...setDocumentUploadModeSequence,
      resetScanSessionAction,
    ],
  },
];
