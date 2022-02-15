const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('unsealEntry', () => {
  it('should clear the sealedTo property from the docket entry', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
    });
    docketEntry.unsealEntry();
    expect(docketEntry.sealedTo).toBeUndefined();
  });

  it('should set the isSealed property to false', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isSealed: undefined },
      {
        applicationContext,
      },
    );
    docketEntry.unsealEntry();

    expect(docketEntry.isSealed).toBe(false);
  });
});
