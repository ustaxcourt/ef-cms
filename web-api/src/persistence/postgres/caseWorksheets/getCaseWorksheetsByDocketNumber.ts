import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { fromKyselyCaseWorksheet } from '@web-api/persistence/postgres/caseWorksheets/mapper';
import { getDbReader } from '@web-api/database';
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
    fromKyselyCaseWorksheet(caseWorkSheet),
  );
};
