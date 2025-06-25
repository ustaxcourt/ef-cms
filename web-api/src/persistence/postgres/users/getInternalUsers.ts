import { getDbReader } from '@web-api/database';
import {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';

export const getInternalUsers = async () => {
  const users = await getDbReader(db =>
    db
      .selectFrom('dwUser')
      .where('section', 'in', [DOCKET_SECTION, PETITIONS_SECTION, ADC_SECTION])
      .selectAll()
      .execute(),
  );

  return users;
};
