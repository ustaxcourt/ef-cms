import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { setIsScanningFalseAction } from '../actions/setIsScanningFalseAction';
import { updateFormValueSequence } from './updateFormValueSequence';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';

export const setDocumentForUploadSequence = [
  validateFileSizeAction,
  {
    invalid: [setIsScanningFalseAction],
    valid: [
      getFormValueDocumentAction,
      updateFormValueSequence,
      updateOrderForDesignatingPlaceOfTrialAction,
      updateOrderForOdsAction,
      getFormValueDocumentSizeAction,
      updateFormValueSequence,
      selectDocumentForPreviewSequence,
      setDocumentUploadModeSequence,
    ],
  },
];
