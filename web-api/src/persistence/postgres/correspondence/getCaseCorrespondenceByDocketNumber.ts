import { Correspondence } from '@shared/business/entities/Correspondence';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/correspondence/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseCorrespondenceByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<Correspondence[]> => {
  const correspondence = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence as cc')
      .leftJoin('dwCase as c', 'c.docketNumber', 'cc.docketNumber')
      .where('cc.docketNumber', '=', docketNumber)
      .selectAll()
      .select('cc.docketNumber')
      .execute(),
  );

  return correspondence.map(c => caseCorrespondenceEntity(c));
};
