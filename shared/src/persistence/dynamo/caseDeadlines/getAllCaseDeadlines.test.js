const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getAllCaseDeadlines } = require('./getAllCaseDeadlines');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAllCaseDeadlines', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'case-deadline-catalog',
      },
    ]);

    const batchGetStub = sinon.stub(client, 'batchGet');
    batchGetStub.onFirstCall().resolves([
      {
        caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseId: MOCK_CASE.caseId,
        pk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        sk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);
    batchGetStub
      .onSecondCall()
      .resolves([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  afterEach(() => {
    client.query.restore();
    client.batchGet.restore();
  });

  it('should get the all cases deadlines', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getAllCaseDeadlines({
      applicationContext,
    });
    expect(result[0].docketNumber).toEqual('101-18');
  });
});
