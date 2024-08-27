import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('unsetAsHighPriority', () => {
  it('unsets the case as high priority', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        highPriority: true,
        highPriorityReason: 'because reasons',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.highPriority).toBeTruthy();

    caseToUpdate.unsetAsHighPriority();

    expect(caseToUpdate.highPriority).toBeFalsy();
    expect(caseToUpdate.highPriorityReason).toBeUndefined();
  });
});
