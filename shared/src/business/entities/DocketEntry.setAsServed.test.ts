import { DocketEntry } from './DocketEntry';
import {
  PARTIES_CODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';

describe('setAsServed', () => {
  const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
  const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';

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

  const MOCK_PETITIONERS = [
    { contactId: mockPrimaryId, name: 'Bob' },
    { contactId: mockSecondaryId, name: 'Bill' },
  ];

  it('sets the Document as served', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        draftOrderState: {
          documentContents: 'Yee to the haw',
        },
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );
    docketEntry.setAsServed();

    expect(docketEntry.servedAt).toBeDefined();
    expect(docketEntry.draftOrderState).toBeUndefined();
  });

  it('sets the Document as served with served parties', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    docketEntry.setAsServed([
      {
        name: 'Served Party',
      },
    ]);

    expect(docketEntry.servedAt).toBeDefined();
    expect(docketEntry.servedParties).toMatchObject([{ name: 'Served Party' }]);
  });

  it('should set the servedPartyCode as R when event code is ATP', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        eventCode: 'ATP',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    docketEntry.setAsServed([
      {
        name: 'NOT IRS SUPER USER',
        role: ROLES.admin,
      },
    ]);

    expect(docketEntry.servedAt).toBeDefined();
    expect(docketEntry.draftOrderState).not.toBeDefined();
    const expectedServedParties = [
      {
        name: 'IRS',
        role: ROLES.irsSuperuser,
      },
    ];
    expect(docketEntry.servedParties).toEqual(expectedServedParties);
    expect(docketEntry.servedPartiesCode).toEqual(PARTIES_CODES.RESPONDENT);
  });
});
