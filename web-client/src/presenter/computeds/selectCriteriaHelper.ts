import {
  AUTOMATIC_BLOCKED_REASONS,
  AutomaticBlockedReasons,
  CASE_STATUS_TYPES,
  CaseStatus,
  PROCEDURE_TYPES_MAP,
  ProcedureType,
} from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const selectCriteriaHelper = (
  get: Get,
): {
  automaticBlockedReasons: {
    key: string;
    value:
      | AutomaticBlockedReasons
      | 'Manual Block'
      | 'Grouped with blocked case';
  }[];
  caseStatuses: { key: string; value: CaseStatus }[];
  procedureTypes: { key: string; value: ProcedureType }[];
} => {
  const blockedCases = get(state.blockedCases);

  const automaticBlockedReasons: {
    key: string;
    value:
      | AutomaticBlockedReasons
      | 'Manual Block'
      | 'Grouped with blocked case';
  }[] = Object.entries(AUTOMATIC_BLOCKED_REASONS)
    .map(([key, value]) => ({
      key,
      value,
    }))
    .filter(reason => {
      return blockedCases.some(
        bc => bc.automaticBlockedReason === reason.value,
      );
    });

  if (blockedCases.some(bc => !!bc.blockedReason)) {
    automaticBlockedReasons.push({
      key: 'manualBlock',
      value: 'Manual Block',
    });
  }

  if (blockedCases.some(bc => !bc.blocked && !bc.automaticBlocked)) {
    automaticBlockedReasons.push({
      key: 'groupedWithBlockedCase',
      value: 'Grouped with blocked case',
    });
  }

  const caseStatuses: { key: string; value: CaseStatus }[] = Object.entries(
    CASE_STATUS_TYPES,
  )
    .map(([key, value]) => ({
      key,
      value,
    }))
    .filter(option => blockedCases.some(c => c.status === option.value));

  const procedureTypes = Object.entries(PROCEDURE_TYPES_MAP).map(
    ([key, value]) => ({ key, value }),
  );

  const sortByLabel = (a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  };

  return {
    automaticBlockedReasons: automaticBlockedReasons.sort(sortByLabel),
    caseStatuses: caseStatuses.sort(sortByLabel),
    procedureTypes: procedureTypes.sort(sortByLabel),
  };
};
