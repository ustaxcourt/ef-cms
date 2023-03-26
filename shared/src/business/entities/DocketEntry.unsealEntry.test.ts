import { A_VALID_DOCKET_ENTRY } from './DocketEntry.test';
import { DOCKET_ENTRY_SEALED_TO_TYPES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';

describe('unsealEntry', () => {
  it('should clear the sealedTo property from the docket entry', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
      },
      {
        applicationContext,
      },
    );
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

  it('should set the isLegacySealed to false', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isLegacySealed: true },
      {
        applicationContext,
      },
    );
    docketEntry.unsealEntry();

    expect(docketEntry.isLegacySealed).toBe(false);
  });
});
