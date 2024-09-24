import { UpdateUserEmailForm } from '../entities/UpdateUserEmailForm';

export const validateUpdateUserEmailInteractor = ({
  updateUserEmailForm,
}: {
  updateUserEmailForm: { email: string; confirmEmail: string };
}) => {
  return new UpdateUserEmailForm(
    updateUserEmailForm,
  ).getFormattedValidationErrors();
};
