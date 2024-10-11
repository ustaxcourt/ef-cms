import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const updateCaseWorksheet = async ({
  caseWorksheet,
  judgeUserId,
}: {
  caseWorksheet: RawCaseWorksheet;
  judgeUserId: string;
}): Promise<CaseWorksheet> => {
  const caseWorksheetToUpsert = {
    docketNumber: caseWorksheet.docketNumber,
    finalBriefDueDate: calculateDate({
      dateString: caseWorksheet.finalBriefDueDate,
    }),
    judgeUserId,
    primaryIssue: caseWorksheet.primaryIssue,
    statusOfMatter: caseWorksheet.statusOfMatter,
  };
  const result = await getDbWriter(writer =>
    writer
      .insertInto('dwCaseWorksheet')
      .values(caseWorksheetToUpsert)
      .onConflict(oc =>
        oc.column('docketNumber').doUpdateSet(caseWorksheetToUpsert),
      )
      .execute(),
  );

  return new CaseWorksheet(result);
};
