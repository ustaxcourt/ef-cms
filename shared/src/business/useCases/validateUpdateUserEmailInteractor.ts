import { EmailConfirmationForm } from '../entities/EmailConfirmationForm';

export const validateUpdateUserEmailInteractor = ({
  updateUserEmailForm,
}: {
  updateUserEmailForm: { email: string; confirmEmail: string };
}) => {
  return new EmailConfirmationForm(
    updateUserEmailForm,
  ).getFormattedValidationErrors();
};
