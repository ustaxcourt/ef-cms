import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getUsersInSections = async ({
  sections,
}: {
  sections: string[];
}): Promise<User[]> => {
  const users = await getDbReader(async reader => {
    let query = reader.selectFrom('dwUser as u');

    if (sections.includes(ROLES.judge)) {
      query = query.where('u.role', 'in', [ROLES.judge, ROLES.legacyJudge]);
    } else {
      query = query.where('u.section', 'in', sections);
    }

    return query.selectAll('u').execute();
  });

  return users.map(user => userEntity(user));
};
