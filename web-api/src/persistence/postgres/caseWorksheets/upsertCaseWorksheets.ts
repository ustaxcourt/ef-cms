import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseWorksheets = async (
  caseWorksheets: RawCaseWorksheet[],
): Promise<CaseWorksheet[]> => {
  const caseWorksheetsToUpsert = caseWorksheets.map(cw => {
    return {
      docketNumber: cw.docketNumber,
      finalBriefDueDate: cw.finalBriefDueDate
        ? calculateDate({ dateString: cw.finalBriefDueDate })
        : null,
      judgeUserId: cw.judgeUserId,
      primaryIssue: cw.primaryIssue,
      statusOfMatter: cw.statusOfMatter,
    };
  });

  const results = await pgInsertInto({
    table: 'dwCaseWorksheet',
    values: caseWorksheetsToUpsert,
    onConflictColumns: ['docketNumber'],
  });

  return results.map(cw => new CaseWorksheet(cw));
};
