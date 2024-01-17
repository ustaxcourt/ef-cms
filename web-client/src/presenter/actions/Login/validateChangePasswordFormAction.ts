import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateChangePasswordFormAction = ({
  get,
  path,
}: ActionProps) => {
  const authenticationState = get(state.authentication);

  const errors = new ChangePasswordForm({
    confirmPassword: authenticationState.form.confirmPassword,
    password: authenticationState.form.password,
    userEmail: authenticationState.userEmail,
  }).getFormattedValidationErrors();

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
