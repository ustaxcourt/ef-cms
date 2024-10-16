import { EmailConfirmationForm } from '@shared/business/entities/EmailConfirmationForm';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateEmailConfirmationFormAction = ({
  get,
  path,
  props,
}: ActionProps) => {
  const { confirmEmail, email, updatedEmail } = get(state.form);
  const emailToValidate = updatedEmail || email;
  const formEntity = new EmailConfirmationForm({
    confirmEmail,
    email: emailToValidate,
  });

  const currentValidationErrors = get(state.validationErrors);

  let errors = formEntity.getFormattedValidationErrors();

  for (let error in errors) {
    if (error !== props.field && !currentValidationErrors[error]) {
      delete errors[error];
    }
  }

  if (Object.keys(currentValidationErrors).includes(props.field)) {
    delete currentValidationErrors[props.field];
  }
  errors = { ...currentValidationErrors, ...errors };

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      errors,
    });
  }
};
