import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('canConsolidate', () => {
  let caseEntity;

  beforeEach(() => {
    caseEntity = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.submitted },
      {
        applicationContext,
      },
    );
  });

  it('should return false when the case status is New', () => {
    caseEntity.status = CASE_STATUS_TYPES.new;

    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should return false when the case status is General Docket', () => {
    caseEntity.status = CASE_STATUS_TYPES.generalDocket;

    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should return false when the case status is On Appeal', () => {
    caseEntity.status = CASE_STATUS_TYPES.onAppeal;

    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should return false when the case status is Closed', () => {
    caseEntity.status = CASE_STATUS_TYPES.closed;

    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should return false when the case status is Closed - Dismissed', () => {
    caseEntity.status = CASE_STATUS_TYPES.closedDismissed;

    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should return true when a case has a case status that is eligible for consolidation', () => {
    const result = caseEntity.canConsolidate();

    expect(result).toEqual(true);
  });

  it('should accept a case for consolidation as a param to check its eligible case status', () => {
    let result;

    // verify a failure on the current (this) case
    caseEntity.status = CASE_STATUS_TYPES.new;
    result = caseEntity.canConsolidate();
    expect(result).toEqual(false);

    // should also fail because duplicate of (this) case
    const otherCase = { ...caseEntity };
    result = caseEntity.canConsolidate(otherCase);
    expect(result).toEqual(false);

    otherCase.status = CASE_STATUS_TYPES.submitted;
    result = caseEntity.canConsolidate(otherCase);
    expect(result).toEqual(true);
  });
});
