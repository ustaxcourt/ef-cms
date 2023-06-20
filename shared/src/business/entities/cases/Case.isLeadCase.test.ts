import { isLeadCase } from './Case';

describe('isLeadCase', () => {
  const mockDocketNumber = '101-22';

  it('should be false when leadDocketNumber is undefined', () => {
    const result = isLeadCase({
      docketNumber: mockDocketNumber,
      leadDocketNumber: undefined,
    });

    expect(result).toBe(false);
  });

  it('should be false when the case`s docketNumber is different than leadDocketNumber', () => {
    const result = isLeadCase({
      docketNumber: mockDocketNumber,
      leadDocketNumber: '999-22',
    });

    expect(result).toBe(false);
  });

  it('should be true when the case`s docketNumber is the same as leadDocketNumber', () => {
    const result = isLeadCase({
      docketNumber: mockDocketNumber,
      leadDocketNumber: mockDocketNumber,
    });

    expect(result).toBe(true);
  });
});
