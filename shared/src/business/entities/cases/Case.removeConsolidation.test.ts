import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('removeConsolidation', () => {
  it('Should unset the leadDocketNumber on the given case', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        leadDocketNumber: '101-20',
        preferredTrialCity: 'Birmingham, Alabama',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.submitted,
      },
      { authorizedUser: mockDocketClerkUser },
    );
    const result = caseEntity.removeConsolidation();

    expect(result.leadDocketNumber).toBeUndefined();
  });
});
