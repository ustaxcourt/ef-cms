import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@web-api/applicationContext';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getUserGateway } from '@web-api/getUserGateway';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const createNewPetitionerUser = async ({
  user,
}: {
  user: RawUser;
}): Promise<void> => {
  const createUserPromise = getUserGateway().createUser(applicationContext, {
    email: user.pendingEmail!,
    name: user.name,
    role: ROLES.petitioner,
    sendWelcomeEmail: true,
    userId: user.userId,
  });

  const postgresCreatePromise = upsertUsers([user]);

  await settlePromises([createUserPromise, postgresCreatePromise]);
};
