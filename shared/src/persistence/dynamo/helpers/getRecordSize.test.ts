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
});
