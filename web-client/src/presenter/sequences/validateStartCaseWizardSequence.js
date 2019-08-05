import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateStartCaseWizardAction } from '../actions/StartCase/validateStartCaseWizardAction';

export const validateStartCaseWizardSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateStartCaseWizardAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
