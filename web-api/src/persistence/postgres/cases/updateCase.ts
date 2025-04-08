import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { isEmpty } from 'lodash';
import { clearCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/clearCaseStatistics';
import { clearPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/clearPetitionersOnCase';

export const updateCase = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const updatedCase = await pgUpdateTable({
    table: 'dwCase',
    values: toKyselyNewCase(caseToUpdate),
    where: qb => qb.where('docketNumber', '=', caseToUpdate.docketNumber),
  });

  // Because we used to have nested objects in our case records, we upserted everything.
  // Now, with separate tables, we need to update these separate tables as well.
  // In the future, we should try to avoid upserting everything.
  await Promise.all([
    upsertCaseStatusUpdates({
      docketNumber: caseToUpdate.docketNumber,
      statusUpdates: caseToUpdate.caseStatusHistory as CaseStatusChange[],
    }),
    clearAndUpsertPetitioners({ caseToUpdate }),
    clearAndUpsertStatistics({ caseToUpdate }),
  ]);

  if (isEmpty(updatedCase)) {
    throw new Error('could not update the case');
  }

  return caseToUpdate;
};

const clearAndUpsertPetitioners = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}) => {
  await clearPetitionersOnCase({ docketNumber: caseToUpdate.docketNumber });
  await upsertPetitionersOnCase({
    docketNumber: caseToUpdate.docketNumber,
    petitionerCase: caseToUpdate,
  });
};

const clearAndUpsertStatistics = async ({
  caseToUpdate,
}: {
  caseToUpdate: RawCase;
}) => {
  await clearCaseStatistics({ docketNumber: caseToUpdate.docketNumber });
  if (caseToUpdate.statistics) {
    await upsertCaseStatistics({
      docketNumber: caseToUpdate.docketNumber,
      statistics: caseToUpdate.statistics,
    });
  }
};
