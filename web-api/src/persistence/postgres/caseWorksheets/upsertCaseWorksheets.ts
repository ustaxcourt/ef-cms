import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  fromKyselyCaseWorksheet,
  toKyselyNewCaseWorksheet,
} from '@web-api/persistence/postgres/caseWorksheets/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseWorksheets = async (
  caseWorksheets: RawCaseWorksheet[],
): Promise<CaseWorksheet[]> => {
  const caseWorksheetsToUpsert = caseWorksheets.map(cw =>
    toKyselyNewCaseWorksheet(cw),
  );

  const results = await pgInsertInto({
    table: 'dwCaseWorksheet',
    values: caseWorksheetsToUpsert,
    onConflictColumns: ['docketNumber'],
  });

  return results.map(cw => fromKyselyCaseWorksheet(cw));
};
