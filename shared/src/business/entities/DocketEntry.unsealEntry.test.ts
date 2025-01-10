import { DOCKET_ENTRY_SEALED_TO_TYPES, ROLES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';

describe('unsealEntry', () => {
  const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';

  const A_VALID_DOCKET_ENTRY = {
    createdAt: '2020-07-17T19:28:29.675Z',
    docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
    docketNumber: '101-21',
    documentType: 'Petition',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    filedByRole: ROLES.petitioner,
    filers: [mockPrimaryId],
    receivedAt: '2020-07-17T19:28:29.675Z',
    userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
  };

  it('should clear the sealedTo property from the docket entry', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
      },
      {
        authorizedUser: undefined,
      },
    );
    docketEntry.unsealEntry();
    expect(docketEntry.sealedTo).toBeUndefined();
  });

  it('should set the isSealed property to false', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isSealed: undefined },
      {
        authorizedUser: undefined,
      },
    );
    docketEntry.unsealEntry();

    expect(docketEntry.isSealed).toBe(false);
  });

  it('should set the isLegacySealed to false', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, isLegacySealed: true },
      {
        authorizedUser: undefined,
      },
    );
    docketEntry.unsealEntry();

    expect(docketEntry.isLegacySealed).toBe(false);
  });
});
