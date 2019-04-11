import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateExternalDocumentInformationAction } from '../actions/validateExternalDocumentInformation';

export const validateExternalDocumentInformationSequence = [
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
