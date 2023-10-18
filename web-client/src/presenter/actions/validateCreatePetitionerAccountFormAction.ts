import { CreateAccountForm } from '@shared/business/entities/CreateAccountForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCreatePetitionerAccountFormAction = ({
  get,
  path,
}: ActionProps) => {
  const petitionerInfo = get(state.form);

  const errors = new CreateAccountForm(
    petitionerInfo,
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
