const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { canConsolidateInteractor } = require('./canConsolidateInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('canConsolidateInteractor', () => {
  let currentCase;
  let caseToConsolidate;

  beforeEach(() => {
    currentCase = {
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      procedureType: 'regular',
      status: 'Submitted',
    };

    caseToConsolidate = {
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      docketNumber: '102-19',
      procedureType: 'regular',
      status: 'Submitted',
    };
  });

  it('should return true when cases are consolidatable', () => {
    const result = canConsolidateInteractor({
      applicationContext,
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(true);
  });

  it('should return false when cases are not consolidatable', () => {
    caseToConsolidate.status = 'Closed';

    const result = canConsolidateInteractor({
      applicationContext,
      caseToConsolidate,
      currentCase,
    });

    expect(result.canConsolidate).toEqual(false);
  });
});
