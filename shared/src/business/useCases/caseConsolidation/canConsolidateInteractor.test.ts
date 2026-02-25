import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { canConsolidateInteractor } from './canConsolidateInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('canConsolidateInteractor', () => {
  let currentCase;
  let caseToConsolidate;

  beforeEach(() => {
    currentCase = {
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      procedureType: 'Regular',
      status: CASE_STATUS_TYPES.submitted,
    };

    caseToConsolidate = {
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      docketNumber: '102-19',
      procedureType: 'Regular',
      status: CASE_STATUS_TYPES.submitted,
    };
  });

  it('should return true when cases are consolidatable', () => {
    const result = canConsolidateInteractor(mockDocketClerkUser, {
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(true);
  });

  it('should return false when cases are not consolidatable', () => {
    caseToConsolidate.status = CASE_STATUS_TYPES.closed;

    const result = canConsolidateInteractor(mockDocketClerkUser, {
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(false);
  });

  it('should return false with reason when caseToConsolidate is not found', () => {
    const result = canConsolidateInteractor(mockDocketClerkUser, {
      caseToConsolidate: undefined as unknown as any,
      currentCase,
    });

    expect(result).toEqual({
      canConsolidate: false,
      reason: ['Case to consolidate is not found'],
    });
  });

  it('should return false with reason when currentCase is not found', () => {
    const result = canConsolidateInteractor(mockDocketClerkUser, {
      caseToConsolidate,
      currentCase: undefined as unknown as any,
    });

    expect(result).toEqual({
      canConsolidate: false,
      reason: ['Current case is not found'],
    });
  });
});
