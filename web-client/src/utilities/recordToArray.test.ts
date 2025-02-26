import { recordToArray } from './recordToArray';

describe('recordToArray', () => {
  it('should convert an empty record to an empty array', () => {
    const result = recordToArray({});
    expect(result).toEqual([]);
  });

  it('should maintain insertion order and remove renderKey from output', () => {
    const input = {
      key2: { id: 2, name: 'Jane', renderKey: 'B' },
      key1: { id: 1, name: 'John', renderKey: 'A' },
      key3: { id: 3, name: 'Bob', renderKey: 'C' },
    };

    const result = recordToArray(input);

    expect(result).toEqual([
      { id: 2, name: 'Jane' },
      { id: 1, name: 'John' },
      { id: 3, name: 'Bob' },
    ]);
  });
});
