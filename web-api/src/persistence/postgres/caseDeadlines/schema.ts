import { Selectable, Insertable } from 'kysely';

const DEFAULT = {};

export const caseDeadlineTableDefinition = {
  associatedJudge: DEFAULT as string,
  associatedJudgeId: DEFAULT as string | null,
  caseDeadlineId: DEFAULT as string,
  createdAt: DEFAULT as Date,
  deadlineDate: DEFAULT as Date,
  description: DEFAULT as string,
  docketNumber: DEFAULT as string,
  sortableDocketNumber: DEFAULT as number,
};

export type CaseDeadlineTable = typeof caseDeadlineTableDefinition;

export const DW_CASE_DEADLINE_COLUMNS = Object.keys(
  caseDeadlineTableDefinition,
) as Array<keyof CaseDeadlineTable>;

export type CaseDeadlineKysely = Selectable<CaseDeadlineTable>;
export type NewCaseDeadlineKysely = Insertable<CaseDeadlineTable>;
