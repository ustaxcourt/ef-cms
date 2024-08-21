import {
  AUTOMATIC_BLOCKED_REASONS,
  AutomaticBlockedReasons,
  CASE_STATUS_TYPES,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';

type SelectCriteriaHelperResults = {
  automaticBlockedReasons: { key: string; value: AutomaticBlockedReasons }[];
  caseStatuses: { key: string; value: CaseStatus }[];
};

export const selectCriteriaHelperInternal = (): SelectCriteriaHelperResults => {
  const automaticBlockedReasons = Object.entries(AUTOMATIC_BLOCKED_REASONS).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  const caseStatuses: { key: string; value: CaseStatus }[] = Object.entries(
    CASE_STATUS_TYPES,
  ).map(([key, value]) => ({
    key,
    value,
  }));

  return {
    automaticBlockedReasons,
    caseStatuses,
  };
};

export const selectCriteriaHelper =
  selectCriteriaHelperInternal as unknown as SelectCriteriaHelperResults;
