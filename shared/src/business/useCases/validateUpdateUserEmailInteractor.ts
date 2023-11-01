import { TValidationError } from '@shared/business/entities/joiValidationEntity/helper';
import { UpdateUserEmail } from '../entities/UpdateUserEmail';

export const validateUpdateUserEmailInteractor = ({
  updateUserEmail,
}: {
  updateUserEmail: { email: string; confirmEmail: string };
}): TValidationError | null => {
  return new UpdateUserEmail(updateUserEmail).getValidationErrors();
};
