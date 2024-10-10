import { EmailConfirmationForm } from '@shared/business/entities/EmailConfirmationForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const validateEmailFormHelper = (get: Get): any => {
  const form = get(state.form);
  const formEntity = new EmailConfirmationForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  return {
    confirmEmailErrorMessage: errors?.confirmEmail,
    emailErrorMessage: errors?.email,
  };
};
