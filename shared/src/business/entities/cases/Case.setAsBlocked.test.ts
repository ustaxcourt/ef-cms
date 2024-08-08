import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setAsBlocked', () => {
  it('sets the case as blocked with a blocked reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.blocked).toBeFalsy();

    caseToUpdate.setAsBlocked('because reasons');

    expect(caseToUpdate.blocked).toEqual(true);
    expect(caseToUpdate.blockedReason).toEqual('because reasons');
    expect(caseToUpdate.blockedDate).toBeDefined();
  });
});
