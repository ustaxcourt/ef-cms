import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app.cerebral';

export const validateNewPetitionerAction = ({ get, path }) => {
  const petitionerUserForm = get(state.form);

  const petitionerUser = new NewPetitionerUser(petitionerUserForm);

  if (!petitionerUser.isValid()) {
    return path.invalid();
  }

  return path.valid();
};
