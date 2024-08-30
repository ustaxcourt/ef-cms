import { A_VALID_DOCKET_ENTRY, MOCK_PETITIONERS } from './DocketEntry.test';
import { DocketEntry } from './DocketEntry';
import {
  PARTIES_CODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('setAsServed', () => {
  it('sets the Document as served', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        draftOrderState: {
          documentContents: 'Yee to the haw',
        },
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
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
      { applicationContext, petitioners: MOCK_PETITIONERS },
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
      { applicationContext, petitioners: MOCK_PETITIONERS },
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
