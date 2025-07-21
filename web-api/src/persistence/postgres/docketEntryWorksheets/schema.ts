import { Selectable } from 'kysely';

const DEFAULT = {};

export const docketEntryWorksheetDefinition = {
  docketEntryId: DEFAULT as string,
  finalBriefDueDate: DEFAULT as Date | null,
  primaryIssue: DEFAULT as string | null,
  statusOfMatter: DEFAULT as string | null,
};

export type DocketEntryWorksheetTable = typeof docketEntryWorksheetDefinition;

export const DW_DOCKET_ENTRY_WORKSHEET_COLUMNS = Object.keys(
  docketEntryWorksheetDefinition,
) as Array<keyof DocketEntryWorksheetTable>;

export type DocketEntryWorksheetKysely = Selectable<DocketEntryWorksheetTable>;
