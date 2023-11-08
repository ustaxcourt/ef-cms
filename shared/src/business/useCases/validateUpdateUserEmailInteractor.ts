import { UpdateUserEmail } from '../entities/UpdateUserEmail';

export const validateUpdateUserEmailInteractor = ({
  updateUserEmail,
}: {
  updateUserEmail: { email: string; confirmEmail: string };
}) => {
  return new UpdateUserEmail(updateUserEmail).getFormattedValidationErrors();
};
