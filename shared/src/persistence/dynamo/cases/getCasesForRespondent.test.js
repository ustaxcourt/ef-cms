const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCasesForRespondent } = require('./getCasesForRespondent');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getCasesForRespondent', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        pk: '123',
        sk: '123',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: '123',
        sk: '123',
      },
    ]);
    sinon.stub(client, 'batchWrite').resolves(null);
    sinon.stub(client, 'updateConsistent').resolves(null);
  });

  afterEach(() => {
    client.get.restore();
    client.delete.restore();
    client.put.restore();
    client.query.restore();
    client.batchGet.restore();
    client.batchWrite.restore();
    client.updateConsistent.restore();
  });

  it('should strip the pk and sk from the results', async () => {
    const result = await getCasesForRespondent({
      applicationContext,
      respondentId: 'taxpayer',
    });
    expect(result).toEqual([{ caseId: '123', status: 'New' }]);
  });
  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCasesForRespondent({
      applicationContext,
      respondentId: 'taxpayer',
    });
    expect(client.batchGet.getCall(0).args[0].keys).toEqual([
      { pk: '123', sk: '0' },
    ]);
  });
});
