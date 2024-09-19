import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateUploadCourtIssuedDocumentAction } from '../actions/UploadCourtIssuedDocument/validateUploadCourtIssuedDocumentAction';

export const validateUploadCourtIssuedDocumentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateUploadCourtIssuedDocumentAction,
      {
        error: [
          setValidationErrorsByFlagAction,
          setValidationAlertErrorsAction,
        ],
        success: [clearAlertsAction],
      },
    ],
  },
];
