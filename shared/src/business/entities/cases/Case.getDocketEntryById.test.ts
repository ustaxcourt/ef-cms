import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocketEntry';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('getDocketEntryById', () => {
  it('should get the docket entry by an Id', () => {
    const myCase = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });
    const result = myCase.getDocketEntryById({
      docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
    });
    expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
  });
});
