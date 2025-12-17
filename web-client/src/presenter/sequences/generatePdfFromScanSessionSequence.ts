import { generatePdfFromScanSessionAction } from '../actions/generatePdfFromScanSessionAction';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { resetScanSessionAction } from '../actions/resetScanSessionAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { setIsScanningFalseAction } from '../actions/setIsScanningFalseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateFormValueSequence } from './updateFormValueSequence';
import { validateDocumentSelectedForScanAction } from '../actions/validateDocumentSelectedForScanAction';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';

export const generatePdfFromScanSessionSequence = showProgressSequenceDecorator(
  [
    validateDocumentSelectedForScanAction,
    {
      error: [setIsScanningFalseAction],
      success: [
        generatePdfFromScanSessionAction,
        {
          error: [handleScanErrorAction],
          success: [
            validateFileSizeAction,
            {
              invalid: [setIsScanningFalseAction],
              valid: [
                getFormValueDocumentAction,
                updateFormValueSequence,
                getFormValueDocumentSizeAction,
                updateFormValueSequence,
                selectDocumentForPreviewSequence,
                setDocumentUploadModeSequence,
                resetScanSessionAction,
              ],
            },
          ],
        },
      ],
    },
  ],
);
