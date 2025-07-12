import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { caseWorksheetEntity } from '@web-api/persistence/postgres/caseWorksheets/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';

export const getCaseWorksheetsByDocketNumber = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<CaseWorksheet[]> => {
  if (isEmpty(docketNumbers)) return [];

  const caseWorksheets = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseWorksheet')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );

  return caseWorksheets.map(caseWorkSheet =>
    caseWorksheetEntity(caseWorkSheet),
  );
};
