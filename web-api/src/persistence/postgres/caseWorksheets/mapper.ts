import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function toKyselyNewCaseWorksheet(caseWorksheet: RawCaseWorksheet) {
  return {
    docketNumber: caseWorksheet.docketNumber,
    finalBriefDueDate: caseWorksheet.finalBriefDueDate
      ? calculateDate({ dateString: caseWorksheet.finalBriefDueDate })
      : null,
    judgeUserId: caseWorksheet.judgeUserId,
    primaryIssue: caseWorksheet.primaryIssue,
    statusOfMatter: caseWorksheet.statusOfMatter,
  };
}

export function fromKyselyCaseWorksheet(caseWorksheet) {
  return new CaseWorksheet(
    transformNullToUndefined({
      ...caseWorksheet,
      filingDate: caseWorksheet.finalBriefDueDate?.toISOString(),
      finalBriefDueDate: caseWorksheet.finalBriefDueDate?.toISOString(),
    }),
  );
}
