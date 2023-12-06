import { applicationContext } from '../../test/createTestApplicationContext';
import { isSealedCase } from './Case';

describe('isSealedCase', () => {
  it('returns false if isSealed is false', () => {
    const result = isSealedCase({
      docketEntries: [],
      isSealed: false,
      name: 'Johnny Appleseed',
      sealedDate: undefined,
    });
    expect(result).toBe(false);
  });

  it('returns false if isSealedDate is undefined', () => {
    const result = isSealedCase({
      docketEntries: [],
      name: 'Johnny Appleseed',
      sealedDate: undefined,
    });
    expect(result).toBe(false);
  });

  it('returns true if the object has truthy values for isSealed or isSealedDate', () => {
    expect(isSealedCase({ isSealed: true })).toBe(true);
    expect(
      isSealedCase({
        sealedDate: applicationContext.getUtilities().createISODateString(),
      }),
    ).toBe(true);
  });
});
