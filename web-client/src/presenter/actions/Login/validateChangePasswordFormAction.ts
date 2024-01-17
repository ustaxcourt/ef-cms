import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateChangePasswordFormAction = ({
  get,
  path,
}: ActionProps) => {
  const changePasswordForm = get(state.form);

  const errors = new ChangePasswordForm(
    changePasswordForm,
  ).getFormattedValidationErrors();

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
