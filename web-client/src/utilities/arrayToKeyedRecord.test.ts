import { arrayToKeyedRecord } from './arrayToKeyedRecord';

describe('arrayToKeyedRecord', () => {
  it('should convert an empty array to an empty record', () => {
    const result = arrayToKeyedRecord([]);
    expect(result).toEqual({});
  });

  it('should convert an array of objects to a record with renderKeys', () => {
    const input = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    const result = arrayToKeyedRecord(input);
    const keys = Object.keys(result);

    expect(result[keys[0]]).toEqual({
      id: 1,
      name: 'John',
      renderKey: keys[0],
    });

    expect(result[keys[1]]).toEqual({
      id: 2,
      name: 'Jane',
      renderKey: keys[1],
    });
  });
});
