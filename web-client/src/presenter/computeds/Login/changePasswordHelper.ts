import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { Get } from 'cerebral';
import { PasswordValidations } from '@shared/business/entities/NewPetitionerUser';
import { convertErrorMessageToPasswordValidationObject } from '@web-client/presenter/computeds/CreatePetitionerAccount/createAccountHelper';
import { state } from '@web-client/presenter/app.cerebral';

export type ChangePasswordHelperResults = {
  confirmPassword: boolean;
  formIsValid: boolean;
  passwordErrors?: PasswordValidations;
};

export const changePasswordHelper = (get: Get): ChangePasswordHelperResults => {
  const authenticationState = get(state.authentication);

  const entity = new ChangePasswordForm({
    confirmPassword: authenticationState.form.confirmPassword,
    password: authenticationState.form.password,
    userEmail: authenticationState.userEmail,
  });

  const errors = entity.getFormattedValidationErrors();

  const passwordErrors: PasswordValidations =
    convertErrorMessageToPasswordValidationObject(errors?.password);

  return {
    confirmPassword: !errors?.confirmPassword,
    formIsValid: entity.isValid(),
    passwordErrors,
  };
};
