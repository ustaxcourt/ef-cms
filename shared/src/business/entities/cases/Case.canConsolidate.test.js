const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

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

  it('should fail when the pending case status is ineligible', () => {
    caseEntity.status = CASE_STATUS_TYPES.new;
    const result = caseEntity.canConsolidate();

    expect(result).toEqual(false);
  });

  it('should pass when a case has an eligible case status', () => {
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
