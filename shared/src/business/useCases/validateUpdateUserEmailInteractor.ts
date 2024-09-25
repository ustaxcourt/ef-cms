import { EmailForm } from '../entities/EmailForm';

export const validateUpdateUserEmailInteractor = ({
  updateUserEmailForm,
}: {
  updateUserEmailForm: { email: string; confirmEmail: string };
}) => {
  return new EmailForm(updateUserEmailForm).getFormattedValidationErrors();
};
