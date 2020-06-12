import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateUploadCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/validateUploadCorrespondenceDocumentAction';

export const validateUploadCorrespondenceDocumentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateUploadCorrespondenceDocumentAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
