import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setAsHighPriority', () => {
  it('sets the case as high priority with a high priority reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.highPriority).toBeFalsy();

    caseToUpdate.setAsHighPriority('because reasons');

    expect(caseToUpdate.highPriority).toEqual(true);
    expect(caseToUpdate.highPriorityReason).toEqual('because reasons');
  });
});
