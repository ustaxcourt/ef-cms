import { RawUser, User } from '@shared/business/entities/User';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';
import { toKyselyUpdateUser, userEntity } from './mapper';
import { isEmpty } from 'lodash';

export const updateUser = async ({
  userToUpdate,
}: {
  userToUpdate: RawUser;
}): Promise<User> => {
  const updatedUser = await pgUpdateTable({
    table: 'dwUser',
    values: toKyselyUpdateUser(userToUpdate),
    where: cb => cb.where('userId', '=', userToUpdate.userId),
  });

  if (isEmpty(updatedUser)) {
    throw new Error('could not update the user');
  }

  return userEntity(updatedUser) as User;
};
