import { Case } from '@shared/business/entities/cases/Case';
import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';

export const createCase = async ({ caseToCreate }: { caseToCreate: Case }) => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values(convertRawCaseToDbRow(caseToCreate))
      .execute(),
  );
};
