import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const updatedCase = await getDbWriter(
    writer =>
      writer
        .updateTable('dwCase')
        .set(convertRawCaseToDbRow(caseToUpdate))
        .where('docketNumber', '=', caseToUpdate.docketNumber)
        .returningAll()
        .executeTakeFirst(),
    'dwCase',
  );

  // Because we used to have nested objects in our case records, we upserted everything.
  // Now, with separate tables, we need to update these separate tables as well.
  // In the future, we should try to avoid upserting everything.
  await upsertCaseStatusUpdates({
    docketNumber: caseToUpdate.docketNumber,
    statusUpdates: caseToUpdate.caseStatusHistory as CaseStatusChange[],
  });

  await upsertPetitionersOnCase({
    docketNumber: caseToUpdate.docketNumber,
    petitioners: caseToUpdate.petitioners.map(p => new Petitioner(p)),
  });

  if (caseToUpdate.statistics) {
    await upsertCaseStatistics({
      docketNumber: caseToUpdate.docketNumber,
      statistics: caseToUpdate.statistics,
    });
  }

  if (!updatedCase) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};
