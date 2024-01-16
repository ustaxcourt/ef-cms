import { Get } from 'cerebral';
import {
  NewPetitionerUser,
  PasswordValidations,
  getDefaultPasswordErrors,
} from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app.cerebral';

export type CreateAccountHelperResults = {
  confirmPassword: boolean;
  email?: string;
  formIsValid: boolean;
  name?: string;
  passwordErrors?: PasswordValidations;
};

export const convertErrorMessageToPasswordValidationObject = (
  stringToParse: string | undefined,
): PasswordValidations => {
  const errorObjects = getDefaultPasswordErrors();
  if (!stringToParse) return errorObjects;

  const errorKeys = stringToParse.split('|');
  for (let error of errorKeys) {
    errorObjects[error].valid = false;
  }

  return errorObjects;
};

export const createAccountHelper = (get: Get): CreateAccountHelperResults => {
  const form = get(state.form);
  const formEntity = new NewPetitionerUser(form);
  const errors = formEntity.getFormattedValidationErrors();

  const passwordErrors: PasswordValidations =
    convertErrorMessageToPasswordValidationObject(errors?.password);

  return {
    confirmPassword: !errors?.confirmPassword,
    email: errors?.email as string,
    formIsValid: formEntity.isValid(),
    name: errors?.name as string,
    passwordErrors,
  };
};
