import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { Get } from 'cerebral';
import {
  PASSWORD_RULE,
  PASSWORD_VALIDATION_ERROR_MESSAGES,
} from '@shared/business/entities/EntityValidationConstants';
import { state } from '@web-client/presenter/app.cerebral';

export type ChangePasswordHelperResults = {
  confirmPassword: boolean;
  formIsValid: boolean;
  passwordErrors: { message: string; valid: boolean }[];
  showForgotPasswordCode: boolean;
};

export const changePasswordHelper = (get: Get): ChangePasswordHelperResults => {
  const authenticationState = get(state.authentication);

  const entity = new ChangePasswordForm({
    confirmPassword: authenticationState.form.confirmPassword,
    email: authenticationState.form.email,
    password: authenticationState.form.password,
  });

  const errors = entity.getFormattedValidationErrors();

  const passwordJoiErrors = PASSWORD_RULE.validate(
    authenticationState.form.password,
    {
      abortEarly: false,
      convert: false,
    },
  );

  const passwordErrors: { message: string; valid: boolean }[] = Object.values(
    PASSWORD_VALIDATION_ERROR_MESSAGES,
  ).map(errorMessage => {
    const invalid = passwordJoiErrors.error?.details.find(
      joiError => joiError.message === errorMessage,
    );
    return {
      message: errorMessage,
      valid: !invalid,
    };
  });

  const showForgotPasswordCode = !authenticationState.tempPassword;

  return {
    confirmPassword: !errors?.confirmPassword,
    formIsValid: entity.isValid(),
    passwordErrors,
    showForgotPasswordCode,
  };
};
