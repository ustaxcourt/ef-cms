import { Case } from '@shared/business/entities/cases/Case';
import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createCase = async ({ caseToCreate }: { caseToCreate: Case }) => {
  await pgInsertInto({
    table: 'dwCase',
    values: [toKyselyNewCase(caseToCreate)],
  });
};
