import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPractitionerDocumentFormAction } from '../actions/validateAddPractitionerDocumentFormAction';

export const validateAddPractitionerDocumentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddPractitionerDocumentFormAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
