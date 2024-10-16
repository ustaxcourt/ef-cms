import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateEmailConfirmationFormAction } from '@web-client/presenter/actions/validateEmailConfirmationFormAction';

export const validateEmailConfirmationFormSequence = [
  validateEmailConfirmationFormAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
] as unknown as (props: { field: string }) => void;
