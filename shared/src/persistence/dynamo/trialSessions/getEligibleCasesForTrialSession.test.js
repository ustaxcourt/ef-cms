const client = require('../../dynamodbClientService');
const {
  getEligibleCasesForTrialSession,
} = require('./getEligibleCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getEligibleCasesForTrialSession', () => {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'eligible-for-trial-case-catalog',
        sk:
          'WashingtonDistrictofColumbia-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);

    client.batchGet = jest
      .fn()
      .mockReturnValue([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  it('should get the cases for a trial session', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getEligibleCasesForTrialSession({
      applicationContext,
    });
    expect(result).toEqual([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });
});
