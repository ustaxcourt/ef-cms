import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';

export const validateNewPetitionerAction = ({ get, path }) => {
  const petitionerUserForm = get(state.form);

  const petitionerUser = new NewPetitionerUser(petitionerUserForm);

  if (!petitionerUser.isValid()) {
    return path.invalid();
  }

  return path.valid();
};
