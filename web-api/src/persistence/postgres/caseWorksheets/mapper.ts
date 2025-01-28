import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function caseWorksheetEntity(caseWorksheet) {
  return new CaseWorksheet(
    transformNullToUndefined({
      ...caseWorksheet,
      filingDate: caseWorksheet.finalBriefDueDate?.toISOString(),
    }),
  );
}
