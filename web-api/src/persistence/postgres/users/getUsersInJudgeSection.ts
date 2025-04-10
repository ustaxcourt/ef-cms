import { ROLES } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUsersInJudgeSection = async (): Promise<User[]> => {
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where(eb =>
        eb.or([
          eb('u.role', '=', ROLES.judge),
          eb('u.role', '=', ROLES.legacyJudge),
        ]),
      )
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user)) as User[];
};
