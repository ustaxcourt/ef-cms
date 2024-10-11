import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowEmailConfirmationFormValidationAction } from '../actions/startShowEmailConfirmationFormValidationAction';
import { validateEmailConfirmationFormAction } from '@web-client/presenter/actions/validateEmailConfirmationFormAction';

export const validateEmailConfirmationFormSequence = [
  startShowEmailConfirmationFormValidationAction,
  validateEmailConfirmationFormAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
] as unknown as (props: { field: string; showValidation: boolean }) => void;
