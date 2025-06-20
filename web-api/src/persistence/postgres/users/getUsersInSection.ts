import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';
import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  DOCKET_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';

export const getUsersInSection = async ({
  section,
}: {
  section: string;
}): Promise<User[]> => {
  const users = await getDbReader(async reader => {
    let query = reader.selectFrom('dwUser as u');

    if (section === ROLES.judge) {
      query = query.where(eb =>
        eb.or([
          eb('u.role', '=', ROLES.judge),
          eb('u.role', '=', ROLES.legacyJudge),
        ]),
      );
    } else if (section === DOCKET_SECTION) {
      query = query.where(eb =>
        eb.or([
          eb('u.section', '=', DOCKET_SECTION),
          eb('u.section', '=', CASE_SERVICES_SUPERVISOR_SECTION),
        ]),
      );
    } else {
      query = query.where('u.section', '=', section);
    }

    return query.selectAll('u').execute();
  });

  return users.map(user => userEntity(user));
};
