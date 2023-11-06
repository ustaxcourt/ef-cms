import { Get } from 'cerebral';
import {
  NewPetitionerUser,
  NewPetitionerUserPasswordValidations,
} from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app-public.cerebral';

export type CreateAccountHelperResults = {
  confirmPassword: boolean;
  email?: string;
  formIsValid: boolean;
  name?: string;
  passwordErrors?: NewPetitionerUserPasswordValidations;
};

export const createAccountHelper = (get: Get): CreateAccountHelperResults => {
  const form = get(state.form);
  const formEntity = new NewPetitionerUser(form);
  const errors = formEntity.getLiveFormattedValidationErrors();

  const passwordErrors: NewPetitionerUserPasswordValidations =
    errors?.password as NewPetitionerUserPasswordValidations;

  return {
    confirmPassword: !errors?.confirmPassword,
    email: errors?.email as string,
    formIsValid: formEntity.isFormValid(errors),
    name: errors?.name as string,
    passwordErrors,
  };
};
