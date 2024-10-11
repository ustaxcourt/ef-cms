import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { caseWorksheetEntity } from '@web-api/persistence/postgres/caseWorksheet/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseWorksheetsByDocketNumber = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<CaseWorksheet[]> => {
  const caseWorksheets = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );

  return caseWorksheets.map(caseWorkSheet =>
    caseWorksheetEntity(caseWorkSheet),
  );
};
