import { PRACTITIONER_ROLES } from '@shared/business/entities/EntityConstants';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewPractitioner, toKyselyNewUser } from './mapper';
import { getUniqueId } from '@shared/sharedAppContext';

// TODO: 10495 Delete this file
export const createUserRecord = async ({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  if (PRACTITIONER_ROLES.includes(user.role)) {
    await pgInsertInto({
      table: 'dwPractitioner',
      values: toKyselyNewPractitioner({
        ...user,
        userId,
        practitionerId: user.practitionerId || getUniqueId(),
      }),
      onConflictColumns: ['userId'],
    });
  }

  await pgInsertInto({
    table: 'dwUser',
    values: toKyselyNewUser({ ...user, userId }),
    onConflictColumns: ['userId'],
  });

  return {
    ...user,
    userId,
  };
};
