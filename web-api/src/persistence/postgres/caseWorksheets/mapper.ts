import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const DW_CASE_WORKSHEET_COLUMNS = [
  'docketNumber',
  'finalBriefDueDate',
  'primaryIssue',
  'statusOfMatter',
  'judgeUserId',
];

export function caseWorksheetEntity(caseWorksheet) {
  return new CaseWorksheet(
    transformNullToUndefined({
      ...caseWorksheet,
      filingDate: caseWorksheet.finalBriefDueDate?.toISOString(),
    }),
  );
}
