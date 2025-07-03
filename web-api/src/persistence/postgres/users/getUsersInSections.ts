import { RawUser } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { rawUser } from '@web-api/persistence/postgres/users/mapper';

export const getUsersInSections = async ({
  sections,
}: {
  sections: string[];
}): Promise<RawUser[]> => {
  const users = await getDbReader(async reader => {
    let query = reader.selectFrom('dwUser as u');

    if (sections.includes(ROLES.judge)) {
      query = query.where('u.role', 'in', [ROLES.judge, ROLES.legacyJudge]);
    } else {
      query = query.where('u.section', 'in', sections);
    }

    return query.selectAll('u').execute();
  });

  return users.map(user => rawUser(user));
};
