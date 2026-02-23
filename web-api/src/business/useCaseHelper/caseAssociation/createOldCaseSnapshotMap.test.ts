import { createOldCaseSnapshotMap } from './createOldCaseSnapshotMap';
import { MOCK_CASE } from '@shared/test/mockCase';

describe('createOldCaseSnapshotMap', () => {
  it('returns a map keyed by docket number', () => {
    const rawCases = [
      { ...MOCK_CASE, docketNumber: '101-25' },
      { ...MOCK_CASE, docketNumber: '102-25' },
    ] as RawCase[];

    const result = createOldCaseSnapshotMap(rawCases);

    expect(result.size).toBe(2);
    expect(result.has('101-25')).toBe(true);
    expect(result.has('102-25')).toBe(true);
  });

  it('returns deep clones that are not affected by mutations to the original', () => {
    const rawCases = [
      { ...MOCK_CASE, docketNumber: '101-25', caseCaption: 'Original Caption' },
    ] as RawCase[];

    const result = createOldCaseSnapshotMap(rawCases);

    // Mutate the original
    rawCases[0].caseCaption = 'Mutated Caption';

    const snapshot = result.get('101-25')!;
    expect(snapshot.caseCaption).toBe('Original Caption');
  });

  it('returns deep clones for nested objects', () => {
    const rawCases = [
      {
        ...MOCK_CASE,
        docketNumber: '101-25',
        docketEntries: [{ docketEntryId: 'abc', documentTitle: 'Original' }],
      },
    ] as RawCase[];

    const result = createOldCaseSnapshotMap(rawCases);

    // Mutate a nested object on the original
    (rawCases[0] as any).docketEntries[0].documentTitle = 'Mutated';

    const snapshot = result.get('101-25')!;
    expect(snapshot.docketEntries[0].documentTitle).toBe('Original');
  });

  it('returns an empty map when given an empty array', () => {
    const result = createOldCaseSnapshotMap([]);

    expect(result.size).toBe(0);
  });
});
