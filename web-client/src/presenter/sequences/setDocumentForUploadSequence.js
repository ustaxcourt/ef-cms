import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { getFormValueDocumentSizeAction } from '../actions/getFormValueDocumentSizeAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateFormValueSequence } from './updateFormValueSequence';
import { validateFileSizeAction } from '../actions/validateFileSizeAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const setDocumentForUploadSequence = [
  validateFileSizeAction,
  {
    invalid: [unsetWaitingForResponseAction, set(state.isScanning, false)],
    valid: [
      getFormValueDocumentAction,
      ...updateFormValueSequence,
      getFormValueDocumentSizeAction,
      ...updateFormValueSequence,
      ...validatePetitionFromPaperSequence,
      ...selectDocumentForPreviewSequence,
      ...setDocumentUploadModeSequence,
    ],
  },
];
