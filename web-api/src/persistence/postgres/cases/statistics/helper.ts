/* eslint-disable custom-rules-plugin/no-new-dates */
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { CaseStatisticKysely } from '@web-api/persistence/postgres/cases/statistics/schema';

// TODO: Remove this workaround after issue 10502 and revert to using standard timestamps.
// In DynamoDB, we depended on the order of items (e.g., index 1 vs. index 2) to determine sequence.
// However, Postgres does not guarantee item order, so instead of adding a one-off field (like statisticNumber or penaltyNumber),
// we adjust the updatedAt timestamp by a small increment based on the index.
// This ensures each updatedAt value is unique and maintains the original ordering from DynamoDB.
export const getUpdatedAtWithIndexBasedIncrement = ({
  index,
}: {
  index: number;
}) => {
  return calculateDate({
    dateString: formatNow(),
    units: 'milliseconds',
    howMuch: index,
  });
};

// Look at tests for how statistics should be sorted
export function sortStatistics(
  statistics: CaseStatisticKysely[],
): CaseStatisticKysely[] {
  return statistics?.sort((a, b) => {
    const aPrimarySort = a.year
      ? new Date(a.year, 0).getTime()
      : a.lastDateOfPeriod?.getTime();
    const bPrimarySort = b.year
      ? new Date(b.year, 0).getTime()
      : b.lastDateOfPeriod?.getTime();
    if (aPrimarySort === bPrimarySort) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
    return aPrimarySort! - bPrimarySort!;
  });
}
