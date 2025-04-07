import { RawUser, User } from '@shared/business/entities/User';
import { toKyselyNewUser, userEntity } from './mapper';
import { createUser } from '@web-api/gateways/user/createUser';
import { applicationContext } from '@web-api/applicationContext';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const createNewPetitionerUser = async ({
  userToCreate,
}: {
  userToCreate: RawUser;
}): Promise<User> => {
  await createUser(applicationContext, {
    email: userToCreate.pendingEmail!,
    name: userToCreate.name,
    role: ROLES.petitioner,
    sendWelcomeEmail: true,
    userId: userToCreate.userId,
  });

  const createdUser = await pgInsertInto({
    table: 'dwUser',
    values: [toKyselyNewUser(userToCreate)],
  });

  return userEntity(createdUser) as User;
};
