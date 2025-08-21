import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { DocketEntryWorksheetKysely } from '@web-api/persistence/postgres/docketEntryWorksheets/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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

export function fromKyselyDocketEntryWorksheet(
  docketEntryWorksheet: DocketEntryWorksheetKysely,
) {
  return new DocketEntryWorksheet({
    ...transformNullToUndefined({
      ...docketEntryWorksheet,
      finalBriefDueDate: docketEntryWorksheet.finalBriefDueDate?.toISOString(),
    }),
  });
}
