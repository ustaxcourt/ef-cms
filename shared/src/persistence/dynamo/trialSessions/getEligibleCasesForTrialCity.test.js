const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getEligibleCasesForTrialCity,
} = require('./getEligibleCasesForTrialCity');

describe('getEligibleCasesForTrialCity', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'eligible-for-trial-case-catalog',
        sk:
          'WashingtonDC-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('should get the cases for a trial city', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getEligibleCasesForTrialCity({
      applicationContext,
      procedureType: 'Regular',
      trialCity: 'WashingtonDC',
    });
    expect(result).toEqual([
      { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
    ]);
  });
});
