import { A_VALID_DOCKET_ENTRY } from './DocketEntry.test';
import { DOCKET_ENTRY_SEALED_TO_TYPES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';

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
