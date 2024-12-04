import { getDbWriter } from '@web-api/database';
import { toNewKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const updatedCase = await getDbWriter(writer =>
    writer
      .updateTable('dwCase')
      .set(toNewKyselyCase(caseToUpdate))
      .where('docketNumber', '=', caseToUpdate.docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  if (!updatedCase) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
