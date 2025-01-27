import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';

export const upsertCaseCorrespondences = async (
  correspondences: RawCorrespondence[],
) => {
  if (isEmpty(correspondences)) {
    return [];
  }

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
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseCorrespondence')
      .values(correspondencesToUpsert)
      .onConflict(oc =>
        oc.column('correspondenceId').doUpdateSet(c => {
          return {
            archived: c.ref('excluded.archived'),
            docketNumber: c.ref('excluded.docketNumber'),
            documentTitle: c.ref('excluded.documentTitle'),
            filedBy: c.ref('excluded.filedBy'),
            filingDate: c.ref('excluded.filingDate'),
            userId: c.ref('excluded.userId'),
          };
        }),
      )
      .execute(),
  );
};
