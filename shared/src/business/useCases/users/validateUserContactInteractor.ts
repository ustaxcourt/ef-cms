import { User } from '../../entities/User';

export const validateUserContactInteractor = ({ user }: { user: any }) => {
  const errors = new User(user).getFormattedValidationErrors();

  return errors || null;
};
