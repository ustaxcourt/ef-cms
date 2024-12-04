import { Case } from '@shared/business/entities/cases/Case';
import { getDbWriter } from '@web-api/database';
import { toNewKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}) => {
  const updatedCase = await getDbWriter(writer =>
    writer
      .updateTable('dwCase')
      .set(toNewKyselyCase(caseToUpdate))
      .where('docketNumber', '=', caseToUpdate.docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  if (!updateCase) {
    throw new Error('could not update the case');
  }

  return new Case(transformNullToUndefined(updatedCase), {
    authorizedUser: undefined,
  });
};
