import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { state } from '@web-client/presenter/app.cerebral';

export const validateNewPetitionerAction = ({ get, path }) => {
  const petitionerUserForm = get(state.form);

  const petitionerUser = new NewPetitionerUser(petitionerUserForm);
  console.log('1111111');
  if (!petitionerUser.isValid()) {
    return path.invalid();
  }

  return path.valid();
};
