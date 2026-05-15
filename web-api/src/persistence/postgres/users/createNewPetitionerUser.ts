import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@web-api/applicationContext';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getUserGateway } from '@web-api/getUserGateway';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import {
  inTransaction,
  onTransactionCommit,
} from '@web-api/persistence/postgres/utils/transactions';

export const createNewPetitionerUser = async ({
  user,
}: {
  user: RawUser;
}): Promise<void> => {
  const createUserForContact = async () => {
    await getUserGateway().createUser(applicationContext, {
      email: user.pendingEmail!,
      name: user.name,
      role: ROLES.petitioner,
      sendWelcomeEmail: true,
      userId: user.userId,
    });
  };

  const postgresCreatePromise = upsertUsers([user]);

  if (inTransaction()) {
    onTransactionCommit(createUserForContact);
    await settlePromises([postgresCreatePromise]);
  } else {
    await settlePromises([createUserForContact(), postgresCreatePromise]);
  }
};
