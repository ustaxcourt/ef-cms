import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';

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

  // 10502 TODO: This is stupid. We should be able to update this only when needed.
  // The current structure of the code--in which we update the case entity and then re-save the whole thing--makes it non-trivial.
  await upsertCaseStatusUpdates({
    docketNumber: caseToUpdate.docketNumber,
    statusUpdates: caseToUpdate.caseStatusHistory as CaseStatusChange[],
  });

  if (!updatedCase) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
