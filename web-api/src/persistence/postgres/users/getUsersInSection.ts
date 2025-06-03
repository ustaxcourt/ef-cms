import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getUsersInSection = async ({
  section,
}: {
  section: string;
}): Promise<User[]> => {
  return await getDbReader(async reader => {
    let query = reader.selectFrom('dwUser as u');

    if (section === ROLES.judge) {
      query = query.where(eb =>
        eb.or([
          eb('u.role', '=', ROLES.judge),
          eb('u.role', '=', ROLES.legacyJudge),
        ]),
      );
    } else if (section === ROLES.docketClerk) {
      query = query.where(eb =>
        eb.or([
          eb('u.section', '=', ROLES.docketClerk),
          eb('u.section', '=', ROLES.caseServicesSupervisor),
        ]),
      );
    } else {
      query = query.where('u.section', '=', section);
    }

    const users = await query.selectAll('u').execute();

    return users.map(user => userEntity(user));
  });
};
