const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DOCKET_ENTRY_SEALED_TO_TYPES } = require('./EntityConstants');
const { DocketEntry } = require('./DocketEntry');

describe('sealEntry', () => {
  it('should set the sealedTo property of the docket entry', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
    });
    docketEntry.sealEntry({ sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC });
    expect(docketEntry.sealedTo).toEqual(DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC);
  });

  it('should set the isSealed property of the docket entry to true', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isSealed: undefined },
      {
        applicationContext,
      },
    );
    docketEntry.sealEntry({ sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC });

    expect(docketEntry.isSealed).toBe(true);
  });
});
