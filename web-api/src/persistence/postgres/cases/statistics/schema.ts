import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const caseStatisticTableDefinition = {
  docketNumber: DEFAULT as string,
  irsDeficiencyAmount: DEFAULT as string,
  irsTotalPenalties: DEFAULT as string,
  statisticId: DEFAULT as string,
  year: DEFAULT as number | null | undefined,
  yearOrPeriod: DEFAULT as string | null | undefined,
  determinationDeficiencyAmount: DEFAULT as string | null | undefined,
  determinationTotalPenalties: DEFAULT as string | null | undefined,
  lastDateOfPeriod: DEFAULT as Date | null | undefined,
  updatedAt: DEFAULT as Date,
};

export type CaseStatisticTable = typeof caseStatisticTableDefinition;

export const DW_CASE_STATISTIC_COLUMNS = Object.keys(
  caseStatisticTableDefinition,
) as Array<keyof CaseStatisticTable>;

export type CaseStatisticKysely = Selectable<CaseStatisticTable>;
export type NewCaseStatisticKysely = Insertable<CaseStatisticTable>;
export type UpdateCaseStatisticKysely = Updateable<CaseStatisticTable>;

export const statisticPenaltyTableDefinition = {
  statisticId: DEFAULT as string,
  name: DEFAULT as string,
  penaltyAmount: DEFAULT as string,
  penaltyId: DEFAULT as string,
  penaltyType: DEFAULT as string,
  updatedAt: DEFAULT as Date,
};

export type StatisticPenaltyTable = typeof statisticPenaltyTableDefinition;

export const DW_STATISTIC_PENALTY_COLUMNS = Object.keys(
  statisticPenaltyTableDefinition,
) as Array<keyof StatisticPenaltyTable>;

export type StatisticPenaltyKysely = Selectable<StatisticPenaltyTable>;
export type NewStatisticPenaltyKysely = Insertable<StatisticPenaltyTable>;
export type UpdateStatisticPenaltyKysely = Updateable<StatisticPenaltyTable>;
