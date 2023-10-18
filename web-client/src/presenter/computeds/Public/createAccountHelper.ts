import {
  CreateAccountForm,
  CreateAccountFormPasswordValidations,
} from '@shared/business/entities/CreateAccountForm';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';

export type CreateAccuntHelperResults = {
  confirmPassword: boolean;
  enableContinueButton: boolean;
  passwordErrors: CreateAccountFormPasswordValidations | undefined;
};

export const createAccountHelper = (get: Get): CreateAccuntHelperResults => {
  const form = get(state.form);
  const formEntity = new CreateAccountForm(form);
  const errors = formEntity.getFormattedValidationErrors();
  const passwordErrors: CreateAccountFormPasswordValidations | undefined =
    errors?.password as CreateAccountFormPasswordValidations | undefined;

  return {
    confirmPassword: !errors?.confirmPassword,
    enableContinueButton: true,
    passwordErrors,
  };
};
