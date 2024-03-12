import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateChangePasswordFormAction = ({
  get,
  path,
}: ActionProps) => {
  const { confirmPassword, email, password } = get(state.authentication.form);

  const errors = new ChangePasswordForm({
    confirmPassword,
    email,
    password,
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
