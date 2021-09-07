import { generatePdfFromScanSessionAction } from '../actions/generatePdfFromScanSessionAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { resetScanSessionAction } from '../actions/resetScanSessionAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { setIsScanningFalseAction } from '../actions/setIsScanningFalseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateFormValueSequence } from './updateFormValueSequence';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const generatePdfFromScanSessionSequence = showProgressSequenceDecorator(
  [
    generatePdfFromScanSessionAction,
    validateFileSizeAction,
    {
      invalid: [setIsScanningFalseAction],
      valid: [
        getFormValueDocumentAction,
        updateFormValueSequence,
        getFormValueDocumentSizeAction,
        updateFormValueSequence,
        validatePetitionFromPaperSequence,
        selectDocumentForPreviewSequence,
        setDocumentUploadModeSequence,
        resetScanSessionAction,
      ],
    },
  ],
);
