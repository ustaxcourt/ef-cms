import { Correspondence } from '@shared/business/entities/Correspondence';
import { fromKyselyCaseCorrespondence } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseCorrespondenceByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<Correspondence[]> => {
  const correspondence = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence as cc')
      .where('cc.docketNumber', '=', docketNumber)
      .selectAll()
      .select('cc.docketNumber')
      .execute(),
  );

  return correspondence.map(c => fromKyselyCaseCorrespondence(c));
};
