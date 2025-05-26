import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { DocketEntryWorksheetKysely } from '@web-api/persistence/postgres/docketEntryWorksheets/schema';

export function toKyselyNewDocketEntryWorksheet({
  docketEntryWorksheet,
}: {
  docketEntryWorksheet: RawDocketEntryWorksheet;
}): DocketEntryWorksheetKysely {
  return {
    docketEntryId: docketEntryWorksheet.docketEntryId,
    primaryIssue: docketEntryWorksheet.primaryIssue ?? null,
    statusOfMatter: docketEntryWorksheet.statusOfMatter ?? null,
    finalBriefDueDate: docketEntryWorksheet.finalBriefDueDate
      ? calculateDate({ dateString: docketEntryWorksheet.finalBriefDueDate })
      : null,
  };
}
