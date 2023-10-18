import {
  CreateAccountForm,
  CreateAccountFormPasswordValidations,
} from '@shared/business/entities/CreateAccountForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';

export type CreateAccuntHelperResults = {
  confirmPassword: boolean;
  email?: string;
  formIsValid: boolean;
  name?: string;
  passwordErrors?: CreateAccountFormPasswordValidations;
};

export const createAccountHelper = (get: Get): CreateAccuntHelperResults => {
  const form = get(state.form);
  const formEntity = new CreateAccountForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  const passwordErrors: CreateAccountFormPasswordValidations =
    errors?.password as CreateAccountFormPasswordValidations;

  return {
    confirmPassword: !errors?.confirmPassword,
    email: errors?.email as string,
    formIsValid: formEntity.isFormValid(errors),
    name: errors?.name as string,
    passwordErrors,
  };
};
