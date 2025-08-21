import { Selectable, Insertable } from 'kysely';

const DEFAULT = {};

export const caseWorksheetTableDefinition = {
  docketNumber: DEFAULT as string,
  finalBriefDueDate: DEFAULT as Date | null | undefined,
  primaryIssue: DEFAULT as string | undefined,
  statusOfMatter: DEFAULT as string | undefined,
  judgeUserId: DEFAULT as string | undefined,
};

export type CaseWorksheetTable = typeof caseWorksheetTableDefinition;

export const DW_CASE_WORKSHEET_COLUMNS = Object.keys(
  caseWorksheetTableDefinition,
) as Array<keyof CaseWorksheetTable>;

export type CaseWorksheetKysely = Selectable<CaseWorksheetTable>;
export type NewCaseWorksheetKysely = Insertable<CaseWorksheetTable>;
