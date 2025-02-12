import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseCorrespondences = async (
  correspondences: RawCorrespondence[],
) => {
  const correspondencesToUpsert = correspondences.map(correspondence => {
    return {
      archived: correspondence.archived,
      correspondenceId: correspondence.correspondenceId,
      docketNumber: correspondence.docketNumber!,
      documentTitle: correspondence.documentTitle,
      filedBy: correspondence.filedBy,
      filingDate: calculateDate({ dateString: correspondence.filingDate }),
      userId: correspondence.userId,
    };
  });

  await pgInsertInto({
    table: 'dwCaseCorrespondence',
    values: correspondencesToUpsert,
    onConflictColumns: ['correspondenceId'],
  });
};
