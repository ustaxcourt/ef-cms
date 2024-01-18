import { Get } from 'cerebral';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import {
  PASSWORD_RULE,
  PASSWORD_VALIDATION_ERROR_MESSAGES,
} from '@shared/business/entities/EntityValidationConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const createAccountHelper = (
  get: Get,
): {
  confirmPassword: boolean;
  email?: string;
  formIsValid: boolean;
  name?: string;
  passwordErrors: { message: string; valid: boolean }[];
} => {
  const form = get(state.form);
  const formEntity = new NewPetitionerUser(form);
  const errors = formEntity.getFormattedValidationErrors();

  const passJoiErrors = PASSWORD_RULE.validate(form.password, {
    abortEarly: false,
    convert: false,
  });

  const passwordErrors: { message: string; valid: boolean }[] = Object.values(
    PASSWORD_VALIDATION_ERROR_MESSAGES,
  ).map(errorMessage => {
    const invalid = passJoiErrors.error?.details.find(
      joiError => joiError.message === errorMessage,
    );
    return {
      message: errorMessage,
      valid: !invalid,
    };
  });

  return {
    confirmPassword: !errors?.confirmPassword,
    email: errors?.email as string,
    formIsValid: formEntity.isValid(),
    name: errors?.name as string,
    passwordErrors,
  };
};
