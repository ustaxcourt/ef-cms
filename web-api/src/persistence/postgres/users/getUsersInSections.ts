import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  AccountStatus,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { DbUser, fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersInSections = async ({
  sections,
  accountStatus,
}: {
  sections: string[];
  accountStatus?: AccountStatus;
}): Promise<DbUser[]> => {
  const users = await getDbReader(async reader => {
    let query = reader.selectFrom('dwUser as u');

    // Note: it is odd we are passing judge in here as judge is not a valid section, but we do it all over our code base
    if (sections.includes(ROLES.judge)) {
      query = query.where('u.role', 'in', [ROLES.judge, ROLES.legacyJudge]);
    } else {
      query = query.where('u.section', 'in', sections);
      if (accountStatus) {
        query = query.where('accountStatus', '=', accountStatus);
      }
    }

    return query.selectAll('u').execute();
  });

  return users.map(user => fromKyselyUser(user));
};
