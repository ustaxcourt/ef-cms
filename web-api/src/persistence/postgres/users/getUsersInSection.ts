import { ROLES } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getUsersInSection = async ({
  section,
}: {
  section: string;
}): Promise<User[]> => {
  // if section passed in is 'judge', then query for users with the role judge or legacyJudge
  let users;
  if (section === 'judge') {
    users = await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .where('u.section', '=', ROLES.judge)
        .where(eb =>
          eb.or([
            eb('u.section', '=', ROLES.judge),
            eb('u.section', '=', ROLES.legacyJudge),
          ]),
        )
        .selectAll('u')
        .execute(),
    );
  } else {
    users = await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .where('u.role', '=', section)
        .selectAll('u')
        .execute(),
    );
  }

  return users.map(user => userEntity(user)) as User[];
};
