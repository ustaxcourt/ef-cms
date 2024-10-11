import { EmailConfirmationForm } from '@shared/business/entities/EmailConfirmationForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateEmailConfirmationFormAction = ({
  get,
  path,
}: ActionProps) => {
  const { confirmEmail, email, updatedEmail } = get(state.form);
  const emailToValidate = updatedEmail || email;
  const formEntity = new EmailConfirmationForm({
    confirmEmail,
    email: emailToValidate,
  });

  const showErrorsToShow = get(state.showValidation);

  const errors = formEntity.getFormattedValidationErrors();

  for (let error in errors) {
    if (!showErrorsToShow[error]) {
      delete errors[error];
    }
  }

  console.log('errors after validation action ran', errors);
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
