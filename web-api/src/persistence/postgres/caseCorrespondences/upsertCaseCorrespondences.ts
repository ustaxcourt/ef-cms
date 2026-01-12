import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { toKyselyNewCaseCorrespondence } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseCorrespondences = async (
  correspondences: RawCorrespondence[],
) => {
  const correspondencesToUpsert = correspondences.map(correspondence =>
    toKyselyNewCaseCorrespondence(correspondence),
  );

  await pgInsertInto({
    table: 'dwCaseCorrespondence',
    values: correspondencesToUpsert,
    onConflictColumns: ['correspondenceId'],
  });
};
