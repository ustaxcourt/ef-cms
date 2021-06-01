const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('removeConsolidation', () => {
  it('Should unset the leadDocketNumber on the given case', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        leadDocketNumber: '101-20',
        preferredTrialCity: 'Birmingham, Alabama',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.submitted,
      },
      { applicationContext },
    );
    const result = caseEntity.removeConsolidation();

    expect(result.leadDocketNumber).toBeUndefined();
  });
});
