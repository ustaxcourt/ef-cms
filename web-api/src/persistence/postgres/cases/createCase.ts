import { Case } from '@shared/business/entities/cases/Case';
import { getDbWriter } from '@web-api/database';
import { toNewKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const createCase = async ({ caseToCreate }: { caseToCreate: Case }) => {
  await getDbWriter(writer =>
    writer.insertInto('dwCase').values(toNewKyselyCase(caseToCreate)).execute(),
  );
};
