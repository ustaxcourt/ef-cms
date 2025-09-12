import { openSearchBatchState } from './getOpenSearchBatchState';

describe('openSearchBatchState', () => {
  it('calculates detectionCeiling as limit+1 when below maxSearchResults', () => {
    const { detectionCeiling, desired } = openSearchBatchState(5000, 10000);
    expect(detectionCeiling).toBe(5001);
    expect(desired).toBe(5000);
  });

  it('caps detectionCeiling at maxSearchResults + 1 when limit exceeds max', () => {
    const { detectionCeiling, desired } = openSearchBatchState(15000, 10000);
    expect(detectionCeiling).toBe(10001);
    expect(desired).toBe(10000);
  });

  it('initializes accumulated as empty array and searchAfter undefined', () => {
    const { accumulated, searchAfter } = openSearchBatchState(10, 100);
    expect(Array.isArray(accumulated)).toBe(true);
    expect(accumulated.length).toBe(0);
    expect(searchAfter).toBeUndefined();
  });
});
