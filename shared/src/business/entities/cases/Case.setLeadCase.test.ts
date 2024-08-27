import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setLeadCase', () => {
  it('Should set the leadDocketNumber on the given case', () => {
    const leadDocketNumber = '101-20';
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        preferredTrialCity: 'Birmingham, Alabama',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.submitted,
      },
      { authorizedUser: mockDocketClerkUser },
    );
    const result = caseEntity.setLeadCase(leadDocketNumber);

    expect(result.leadDocketNumber).toEqual(leadDocketNumber);
  });
});
