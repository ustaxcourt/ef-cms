import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { isEmpty } from 'lodash';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const updatedCase = await pgInsertInto({
    table: 'dwCase',
    values: toKyselyNewCase(caseToUpdate),
    onConflictColumns: ['docketNumber'],
  });

  if (isEmpty(updatedCase)) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
