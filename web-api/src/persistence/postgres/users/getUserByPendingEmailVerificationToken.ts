
import {
  DbUser,
  fromKyselyUser,
} from '@web-api/persistence/postgres/users/mapper';
import { getDbReader } from '../database';

export const getUserByPendingEmailVerificationToken = async ({
  pendingEmailVerificationToken,
}: {
  pendingEmailVerificationToken: string;
}): Promise<DbUser | undefined> => {
  const user = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where(
        'pendingEmailVerificationToken',
        '=',
        pendingEmailVerificationToken,
      )
      .selectAll()
      .executeTakeFirst(),
  );

  if (!user) {
    return undefined;
  }

  return fromKyselyUser(user);
};
