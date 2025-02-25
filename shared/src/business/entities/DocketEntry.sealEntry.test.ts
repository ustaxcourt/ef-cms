import { DOCKET_ENTRY_SEALED_TO_TYPES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { A_VALID_DOCKET_ENTRY } from '@shared/business/entities/DocketEntryTestFixtures';

describe('sealEntry', () => {
  it('should set the sealedTo property of the docket entry', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      authorizedUser: undefined,
    });
    docketEntry.sealEntry({ sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC });
    expect(docketEntry.sealedTo).toEqual(DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC);
  });

  it('should set the isSealed property of the docket entry to true', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isSealed: undefined },
      {
        authorizedUser: undefined,
      },
    );
    docketEntry.sealEntry({ sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC });

    expect(docketEntry.isSealed).toBe(true);
  });
});
