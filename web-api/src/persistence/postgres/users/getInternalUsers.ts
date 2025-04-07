import {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { getDbReader } from '@web-api/database';
import { userEntity } from '@web-api/persistence/postgres/users/mapper';

export const getInternalUsers = async (): Promise<User[]> => {
  const internalUserSections = [DOCKET_SECTION, PETITIONS_SECTION, ADC_SECTION];
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser as u')
      .where('u.section', 'in', internalUserSections)
      .selectAll('u')
      .execute(),
  );

  return users.map(user => userEntity(user)) as User[];
};
