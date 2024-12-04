import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const updatedCase = await getDbWriter(writer =>
    writer
      .updateTable('dwCase')
      .set(convertRawCaseToDbRow(caseToUpdate))
      .where('docketNumber', '=', caseToUpdate.docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  if (!updatedCase) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
