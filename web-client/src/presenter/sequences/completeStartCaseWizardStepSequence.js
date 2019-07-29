import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToStartCaseWizardNextStepAction } from '../actions/StartCase/navigateToStartCaseWizardNextStepAction';
import { set } from 'cerebral/factories';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateStartCaseWizardAction } from '../actions/StartCase/validateStartCaseWizardAction';

export const completeStartCaseWizardStepSequence = [
  set(state.showValidation, true),
  validateStartCaseWizardAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      set(state.showValidation, false),
      navigateToStartCaseWizardNextStepAction,
    ],
  },
];
