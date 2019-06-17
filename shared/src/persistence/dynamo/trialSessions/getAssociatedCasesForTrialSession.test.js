const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getAssociatedCasesForTrialSession,
} = require('./getAssociatedCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAssociatedCasesForTrialSession', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'f3b04943-8ea8-422b-8990-dec3ca644c83|trial-session',
        sk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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

  it('should get the cases associated with a trial session', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getAssociatedCasesForTrialSession({
      applicationContext,
    });
    expect(result).toEqual([MOCK_CASE]);
  });
});
