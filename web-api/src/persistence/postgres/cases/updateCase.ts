import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { upsertCasePetitionersData } from '@web-api/persistence/postgres/cases/parties/upsertCasePetitionersData';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';

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

  // Because we used to have nested objects in our case records, we upserted everything.
  // Now, with separate tables, we need to update these separate tables as well.
  // In the future, we should try to avoid upserting everything.
  await upsertCaseStatusUpdates({
    docketNumber: caseToUpdate.docketNumber,
    statusUpdates: caseToUpdate.caseStatusHistory as CaseStatusChange[],
  });

  await upsertCasePetitionersData({
    docketNumber: caseToUpdate.docketNumber,
    petitionersData: caseToUpdate.petitioners.map(p => new Petitioner(p)),
  });

  if (!updatedCase) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
