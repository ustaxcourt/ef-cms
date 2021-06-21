const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setLeadCase', () => {
  it('Should set the leadDocketNumber on the given case', async () => {
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
