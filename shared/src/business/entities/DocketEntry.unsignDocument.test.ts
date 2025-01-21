import { ROLES } from '@shared/business/entities/EntityConstants';
import { DocketEntry } from './DocketEntry';

describe('unsignDocument', () => {
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

  it('signs and unsigns the document', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      authorizedUser: undefined,
      petitioners: [
        {
          contactId: '7111b30b-ad38-42c8-9db0-d938cb2cb16b',
          contactType: 'primary',
        },
      ],
    });
    docketEntry.setSigned('abc-123', 'Joe Exotic');

    expect(docketEntry.signedByUserId).toEqual('abc-123');
    expect(docketEntry.signedJudgeName).toEqual('Joe Exotic');
    expect(docketEntry.signedAt).toBeDefined();

    docketEntry.unsignDocument();

    expect(docketEntry.signedByUserId).toBeUndefined();
    expect(docketEntry.signedJudgeName).toBeUndefined();
    expect(docketEntry.signedAt).toBeUndefined();
  });
});
