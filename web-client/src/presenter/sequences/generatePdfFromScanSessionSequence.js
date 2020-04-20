import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { generatePdfFromScanSessionAction } from '../actions/generatePdfFromScanSessionAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { resetScanSessionAction } from '../actions/resetScanSessionAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateFormValueSequence } from './updateFormValueSequence';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const generatePdfFromScanSessionSequence = showProgressSequenceDecorator(
  [
    generatePdfFromScanSessionAction,
    validateFileSizeAction,
    {
      invalid: [set(state.scanner.isScanning, false)],
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
  ],
);
