import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';
import { isEmpty } from 'lodash';
import { clearCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/clearCaseStatistics';
import { clearPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/clearPetitionersOnCase';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { settlePromises } from '@web-api/utilities/settlePromises';

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

  // Because we used to have nested objects in our case records, we upserted everything.
  // Now, with separate tables, we need to update these separate tables as well.
  // In the future, we should try to avoid upserting everything.
  await settlePromises([
    upsertCaseStatusUpdates({
      docketNumber: caseToUpdate.docketNumber,
      statusUpdates: caseToUpdate.caseStatusHistory as CaseStatusChange[],
    }),
    clearAndUpsertPetitioners({ caseToUpdate }),
    clearAndUpsertStatistics({ caseToUpdate }),
  ]);

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
