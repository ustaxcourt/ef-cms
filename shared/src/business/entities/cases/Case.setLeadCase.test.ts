import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

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
      { applicationContext },
    );
    const result = caseEntity.setLeadCase(leadDocketNumber);

    expect(result.leadDocketNumber).toEqual(leadDocketNumber);
  });
});
