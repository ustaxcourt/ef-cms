const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { getCasesByUser } = require('./getCasesByUser');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getCasesByUser', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        pk: '123',
        sk: '123',
        caseId: '123',
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
    const result = await getCasesByUser({
      userId: 'taxpayer',
      applicationContext,
    });
    expect(result).to.deep.equal([{ caseId: '123', status: 'New' }]);
  });
  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCasesByUser({
      userId: 'taxpayer',
      applicationContext,
    });
    expect(client.batchGet.getCall(0).args[0].keys).to.deep.equal([
      { pk: '123', sk: '0' },
    ]);
  });
});
