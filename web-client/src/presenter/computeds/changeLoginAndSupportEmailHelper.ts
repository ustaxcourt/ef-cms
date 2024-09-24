import { Get } from 'cerebral';
import { UpdateUserEmailForm } from '@shared/business/entities/UpdateUserEmailForm';
import { state } from '@web-client/presenter/app.cerebral';

export const changeLoginAndSupportEmailHelper = (get: Get) => {
  const form = get(state.form);
  const formEntity = new UpdateUserEmailForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  return {
    confirmEmailErrorMessage: errors?.confirmEmail as string,
    emailErrorMessage: errors?.email as string,
  };
};
