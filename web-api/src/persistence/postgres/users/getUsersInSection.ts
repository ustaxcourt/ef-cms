import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';
import { getUsersInJudgeSection } from './getUsersInJudgeSection';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getUsersInSection = async ({
  section,
}: {
  section: string;
}): Promise<User[]> => {
  if (section === ROLES.judge) {
    return getUsersInJudgeSection();
  }

  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.section', '=', section)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user)) as User[];
};
