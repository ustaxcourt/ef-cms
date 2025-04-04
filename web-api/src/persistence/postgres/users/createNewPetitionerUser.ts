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
  // 10495 TODO: This function contains two separate function calls that should
  // be bundled into one unit of work that prevents one call from suceeding
  // while the other fails
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

  return userEntity(createdUser);
};
