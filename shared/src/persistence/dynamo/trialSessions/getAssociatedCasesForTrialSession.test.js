const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  getAssociatedCasesForTrialSession,
} = require('./getAssociatedCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAssociatedCasesForTrialSession', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseOrder: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
    });

    sinon
      .stub(client, 'batchGet')
      .resolves([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  afterEach(() => {
    client.get.restore();
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
