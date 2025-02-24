import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';

describe('unsetAsBlocked', () => {
  it('unsets the case as blocked', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        blocked: true,
        blockedReason: 'because reasons',
        consolidatedCases: [
          new ConsolidatedCaseSummary(MOCK_CASE).toRawObject(),
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.blocked).toBeTruthy();

    caseToUpdate.unsetAsBlocked();

    expect(caseToUpdate.consolidatedCases[0].blocked).toBeFalsy();
    expect(caseToUpdate.blocked).toBeFalsy();
    expect(caseToUpdate.blockedReason).toBeUndefined();
    expect(caseToUpdate.blockedDate).toBeUndefined();
  });
});
