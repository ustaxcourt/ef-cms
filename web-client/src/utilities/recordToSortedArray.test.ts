import { recordToSortedArray } from './recordToSortedArray';

describe('recordToSortedArray', () => {
  it('should convert an empty record to an empty array', () => {
    const result = recordToSortedArray({});
    expect(result).toEqual([]);
  });

  it('should sort items by renderKey and remove renderKey from output', () => {
    const input = {
      key2: { id: 2, name: 'Jane', renderKey: 'B' },
      key1: { id: 1, name: 'John', renderKey: 'A' },
      key3: { id: 3, name: 'Bob', renderKey: 'C' },
    };

    const result = recordToSortedArray(input);

    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
    ]);
  });
});
