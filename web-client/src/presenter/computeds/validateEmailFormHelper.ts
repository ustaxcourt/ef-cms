import { EmailForm } from '@shared/business/entities/EmailForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const validateEmailFormHelper = (
  get: Get,
): { confirmEmailErrorMessage: string; emailErrorMessage: string } => {
  const form = get(state.form);
  const formEntity = new EmailForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  return {
    confirmEmailErrorMessage: errors?.confirmEmail as string,
    emailErrorMessage: errors?.email as string,
  };
};
