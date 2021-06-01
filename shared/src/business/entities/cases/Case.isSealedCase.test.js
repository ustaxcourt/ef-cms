const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { isSealedCase } = require('./Case');

describe('isSealedCase', () => {
  it('returns false for objects without any truthy sealed attributes', () => {
    const result = isSealedCase({
      docketEntries: [],
      isSealed: false,
      name: 'Johnny Appleseed',
      sealedDate: false,
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

  it('returns true if the object has a docket entry with truthy values for isSealed or isLegacySealed', () => {
    expect(
      isSealedCase({
        docketEntries: [{ isSealed: true }],
        isSealed: false,
        name: 'Johnny Appleseed',
        sealedDate: false,
      }),
    ).toBe(true);
    expect(
      isSealedCase({
        docketEntries: [{ isLegacySealed: true }],
        isSealed: false,
        name: 'Johnny Appleseed',
        sealedDate: false,
      }),
    ).toBe(true);
  });
});
