import {
  CASE_TYPES_MAP,
  PROCEDURE_TYPES_MAP,
  STJ_ALWAYS_ELIGIBLE_CASE_TYPES,
  STJ_IRS_AMOUNT_LIMIT,
} from '@shared/business/entities/EntityConstants';

type StjStatistic = {
  irsDeficiencyAmount: string;
  irsTotalPenalties: string;
};

export type StjEligibilityInputs = {
  caseType: string;
  procedureType?: string;
  statistics?: StjStatistic[];
};

export const calculateStjEligibility = (
  caseToCheck: StjEligibilityInputs,
): boolean => {
  const { caseType, procedureType, statistics = [] } = caseToCheck;

  if (caseType === CASE_TYPES_MAP.innocentSpouse) {
    return procedureType === PROCEDURE_TYPES_MAP.small;
  }

  if (caseType === CASE_TYPES_MAP.deficiency) {
    return statistics.every(
      statistic =>
        Number(statistic.irsDeficiencyAmount) +
          Number(statistic.irsTotalPenalties) <=
        STJ_IRS_AMOUNT_LIMIT,
    );
  }

  return STJ_ALWAYS_ELIGIBLE_CASE_TYPES.includes(caseType);
};
