import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { DbUser, rawUser } from '@web-api/persistence/postgres/users/mapper';

export const getInternalUsers = async (): Promise<DbUser[]> => {
  const users = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('section', 'in', [DOCKET_SECTION, PETITIONS_SECTION, ADC_SECTION])
      .selectAll()
      .execute(),
  );

  return users.map(rawUser);
};
