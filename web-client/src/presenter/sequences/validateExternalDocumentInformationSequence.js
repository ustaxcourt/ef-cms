import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const validateExternalDocumentInformationSequence = [
  startShowValidationAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateExternalDocumentInformationAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
