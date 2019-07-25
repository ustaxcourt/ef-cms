import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeIrsNoticeDateAction } from '../actions/computeIrsNoticeDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateStartCaseWizardAction } from '../actions/StartCase/validateStartCaseWizardAction';

export const validateStartCaseWizardSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeIrsNoticeDateAction,
      validateStartCaseWizardAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
