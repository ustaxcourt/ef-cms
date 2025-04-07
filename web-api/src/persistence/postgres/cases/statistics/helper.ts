import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';

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
