import { CaseStatus, CASE_STATUS_TYPES } from '../entities/EntityConstants';
import {
  createISODateString,
  dateStringsCompared,
  calculateISODate,
} from '../utilities/DateHandler';

const CLOSED_CASE_STATUSES_AND_ON_APPEAL = new Set<CaseStatus>([
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.onAppeal,
]);

const AGED_CASE_THRESHOLD_DAYS = -365;

const getLatestFilingDate = (docketEntries: any[]): string => {
  if (!docketEntries?.length) return createISODateString();

  return (
    docketEntries
      .map(entry => entry.filingDate)
      .filter(Boolean)
      .sort((a, b) => dateStringsCompared(b, a))[0] || createISODateString()
  );
};

const isAgedCase = (
  eligibleCase: Omit<RawCase, 'consolidatedCases'>,
): boolean => {
  // Closed cases are never considered aged
  if (CLOSED_CASE_STATUSES_AND_ON_APPEAL.has(eligibleCase.status)) {
    return false;
  }

  const latestFilingDate = getLatestFilingDate(eligibleCase.docketEntries);
  const thresholdDate = calculateISODate({
    dateString: createISODateString(),
    howMuch: AGED_CASE_THRESHOLD_DAYS,
  });

  return dateStringsCompared(latestFilingDate, thresholdDate) < 0;
};

export const getEligibleCasesWithIsAgedCase = (
  eligibleCases: Omit<RawCase, 'consolidatedCases'>[],
): (Omit<RawCase, 'consolidatedCases'> & { isAgedCase: boolean })[] => {
  return eligibleCases.map(eligibleCase => ({
    ...eligibleCase,
    isAgedCase: isAgedCase(eligibleCase),
  }));
};
