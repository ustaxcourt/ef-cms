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
  const form = get(state.form);
  const formEntity = new ChangePasswordForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  const passwordErrors: PasswordValidations =
    convertErrorMessageToPasswordValidationObject(errors?.password);

  return {
    confirmPassword: !errors?.confirmPassword,
    formIsValid: formEntity.isValid(),
    passwordErrors,
  };
};
