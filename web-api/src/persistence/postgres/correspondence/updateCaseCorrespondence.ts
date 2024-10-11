import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const updateCaseCorrespondence = async ({
  correspondence,
  docketNumber,
}: {
  correspondence: RawCorrespondence;
  docketNumber: string;
}) => {
  const correspondenceToUpsert = {
    archived: correspondence.archived,
    correspondenceId: correspondence.correspondenceId,
    docketNumber,
    // numberOfPages: correspondence.numberOfPages,
    documentTitle: correspondence.documentTitle,
    filedBy: correspondence.filedBy,
    filingDate: calculateDate({ dateString: correspondence.filingDate }),
    userId: correspondence.userId,
  };
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseCorrespondence')
      .values(correspondenceToUpsert)
      .onConflict(oc =>
        oc.column('correspondenceId').doUpdateSet(correspondenceToUpsert),
      )
      .execute(),
  );
};
