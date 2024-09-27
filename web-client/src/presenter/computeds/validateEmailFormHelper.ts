import { EmailForm } from '@shared/business/entities/EmailForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const validateEmailFormHelper = (get: Get): any => {
  const form = get(state.form);
  const formEntity = new EmailForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  return {
    confirmEmailErrorMessage: errors?.confirmEmail,
    emailErrorMessage: errors?.email,
  };
};
