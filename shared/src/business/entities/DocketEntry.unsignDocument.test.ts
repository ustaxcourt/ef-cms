import { A_VALID_DOCKET_ENTRY } from './DocketEntry.test';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';

describe('unsignDocument', () => {
  it('signs and unsigns the document', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
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
