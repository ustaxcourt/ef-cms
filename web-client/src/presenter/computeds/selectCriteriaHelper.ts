import {
  CASE_STATUS_TYPES,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';

type SelectCriteriaHelperResults = {
  caseStatuses: { key: string; value: CaseStatus }[];
};

export const selectCriteriaHelperInternal = (): SelectCriteriaHelperResults => {
  const caseStatuses: { key: string; value: CaseStatus }[] = Object.entries(
    CASE_STATUS_TYPES,
  ).map(([key, value]) => ({
    key,
    value,
  }));

  return {
    caseStatuses,
  };
};

export const selectCriteriaHelper =
  selectCriteriaHelperInternal as unknown as SelectCriteriaHelperResults;
