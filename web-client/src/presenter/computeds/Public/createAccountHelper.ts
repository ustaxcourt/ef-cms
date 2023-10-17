import { CreateAccountForm } from '@shared/business/entities/CreateAccountForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';

export const createAccountHelper = (get: Get) => {
  const form = get(state.form);

  const formEntity = new CreateAccountForm(form);

  const errors = formEntity.getValidationErrors();

  console.log(errors);

  return {
    passwordErrors: [],
  };
};
