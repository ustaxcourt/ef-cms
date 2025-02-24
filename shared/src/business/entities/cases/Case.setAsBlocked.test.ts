import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';

describe('setAsBlocked', () => {
  it('sets the case as blocked with a blocked reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        consolidatedCases: [new ConsolidatedCaseSummary(MOCK_CASE)],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.blocked).toBeFalsy();

    caseToUpdate.setAsBlocked('because reasons');

    expect(caseToUpdate.consolidatedCases[0].blocked).toEqual(true);
    expect(caseToUpdate.blocked).toEqual(true);
    expect(caseToUpdate.blockedReason).toEqual('because reasons');
    expect(caseToUpdate.blockedDate).toBeDefined();
  });
});
