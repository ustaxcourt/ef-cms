const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { canConsolidateInteractor } = require('./canConsolidateInteractor');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

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
    const result = canConsolidateInteractor(applicationContext, {
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(true);
  });

  it('should return false when cases are not consolidatable', () => {
    caseToConsolidate.status = CASE_STATUS_TYPES.closed;

    const result = canConsolidateInteractor(applicationContext, {
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(false);
  });
});
