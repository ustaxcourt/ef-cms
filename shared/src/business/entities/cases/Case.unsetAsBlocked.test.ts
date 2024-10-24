import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('unsetAsBlocked', () => {
  it('unsets the case as blocked', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        blocked: true,
        blockedReason: 'because reasons',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.blocked).toBeTruthy();

    caseToUpdate.unsetAsBlocked();

    expect(caseToUpdate.blocked).toBeFalsy();
    expect(caseToUpdate.blockedReason).toBeUndefined();
    expect(caseToUpdate.blockedDate).toBeUndefined();
  });
});
