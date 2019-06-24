const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getEligibleCasesForTrialSession,
} = require('./getEligibleCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getEligibleCasesForTrialSession', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'eligible-for-trial-case-catalog',
        sk:
          'WashingtonDC-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);

    sinon
      .stub(client, 'batchGet')
      .resolves([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  afterEach(() => {
    client.query.restore();
    client.batchGet.restore();
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
    expect(result).toEqual([MOCK_CASE]);
  });
});
