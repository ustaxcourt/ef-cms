import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const upsertCaseCorrespondences = async (
  correspondences: RawCorrespondence[],
) => {
  const correspondencesToUpsert = correspondences.map(correspondence => {
    return {
      ...correspondence,
      filingDate: calculateDate({ dateString: correspondence.filingDate }),
    };
  });
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseCorrespondence')
      .values(correspondencesToUpsert)
      .onConflict(oc =>
        oc.column('correspondenceId').doUpdateSet(correspondencesToUpsert),
      )
      .execute(),
  );
};
