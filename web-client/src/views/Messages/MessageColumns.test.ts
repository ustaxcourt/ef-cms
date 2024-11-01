import {
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
} from '@shared/business/entities/EntityConstants';
import {
  getAscendingTextForSortType,
  getDescendingTextForSortType,
} from '@web-client/views/Messages/MessageColumns';

describe('Ascending and descending text for sort types', () => {
  it('should use chronologically ascending for date when ascending', () => {
    expect(getAscendingTextForSortType('date')).toBe(CHRONOLOGICALLY_ASCENDING);
  });
  it('should use chronologically descending for date when descending', () => {
    expect(getDescendingTextForSortType('date')).toBe(
      CHRONOLOGICALLY_DESCENDING,
    );
  });
  it('should use alphabetically ascending for string when ascending', () => {
    expect(getAscendingTextForSortType('string')).toBe(
      ALPHABETICALLY_ASCENDING,
    );
  });
  it('should use alphabetically descending for string when descending', () => {
    expect(getDescendingTextForSortType('string')).toBe(
      ALPHABETICALLY_DESCENDING,
    );
  });
});
