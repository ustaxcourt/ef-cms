import { CaseTable } from '@web-api/persistence/postgres/cases/schema';
import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const caseCorrespondenceTableDefinition = {
  archived: DEFAULT as boolean | undefined,
  correspondenceId: DEFAULT as string,
  documentTitle: DEFAULT as string,
  filedBy: DEFAULT as string | undefined,
  filingDate: DEFAULT as Date,
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
};

export type CaseCorrespondenceTable = typeof caseCorrespondenceTableDefinition;

export const DW_CASE_CORRESPONDENCE_COLUMNS = Object.keys(
  caseCorrespondenceTableDefinition,
) as Array<keyof CaseTable>;

export type CaseCorrespondenceKysely = Selectable<CaseCorrespondenceTable>;
export type NewCaseCorrespondenceKysely = Insertable<CaseCorrespondenceTable>;
export type UpdateCaseCorrespondenceKysely =
  Updateable<CaseCorrespondenceTable>;
