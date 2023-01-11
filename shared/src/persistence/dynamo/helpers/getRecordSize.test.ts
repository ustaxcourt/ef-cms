import { getRecordSize } from './getRecordSize';

const validMarshalledRecord = {
  favouriteNumber: {
    N: '-1E-130',
  },
  foods: {
    SS: ['pizza', 'burger'],
  },
  fullName: {
    S: 'Zac Charles',
  },
  id: {
    S: 'f0ba8d6c',
  },
  isAdmin: {
    BOOL: 'true',
  },
  myBinary: {
    B: 'c29tZXRoaW5n',
  },
};

describe('getRecordSize', () => {
  it('should return 0 when the provided record does NOT have any attributes', () => {
    const result = getRecordSize({});

    expect(result).toBe(0);
  });

  it('should return the total size of a valid, marshalled dynamodb record with properties', () => {
    const result = getRecordSize(validMarshalledRecord);

    expect(result).not.toBe(0);
  });

  it('should return the total size of a valid, marshalled dynamodb record with properties', () => {
    const result = getRecordSize(validMarshalledRecord);

    expect(result).toBe(0);
  });
});

describe('calculateAttributeSizeInBytes', () => {
  const attr = {
    Example: {
      B: 'something',
    },
  }; // => size of Example plus the size of something

  const typesToTest = [
    {
      expected: 1,
      name: 'MyBinary',
      type: 'B',
    },
  ];
});
