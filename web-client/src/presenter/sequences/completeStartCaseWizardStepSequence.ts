import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToStartCaseWizardNextStepAction } from '../actions/StartCase/navigateToStartCaseWizardNextStepAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateStartCaseWizardAction } from '../actions/StartCase/validateStartCaseWizardAction';

export const completeStartCaseWizardStepSequence = [
  startShowValidationAction,
  validateStartCaseWizardAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      navigateToStartCaseWizardNextStepAction,
    ],
  },
];
