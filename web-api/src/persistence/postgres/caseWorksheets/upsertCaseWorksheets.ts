import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

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

  const results = await getDbWriter(writer =>
    writer
      .insertInto('dwCaseWorksheet')
      .values(caseWorksheetsToUpsert)
      .onConflict(oc =>
        oc.column('docketNumber').doUpdateSet(cd => {
          return {
            docketNumber: cd.ref('excluded.docketNumber'),
            finalBriefDueDate: cd.ref('excluded.finalBriefDueDate'),
            judgeUserId: cd.ref('excluded.judgeUserId'),
            primaryIssue: cd.ref('excluded.primaryIssue'),
            statusOfMatter: cd.ref('excluded.statusOfMatter'),
          };
        }),
      )
      .execute(),
  );

  return results.map(cw => new CaseWorksheet(cw));
};
