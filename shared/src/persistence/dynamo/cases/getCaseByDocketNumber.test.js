const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { getCaseByDocketNumber } = require('./getCaseByDocketNumber');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  isAuthorizedForWorkItems: () => true,
};

describe('getCaseByDocketNumber', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'put').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'delete').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        pk: '123',
        sk: '123',
        caseId: '123',
        status: 'new',
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

  it('should strip the pk and sk from the case', async () => {
    const result = await getCaseByDocketNumber({
      pk: '123',
      sk: '123',
      docketNumber: '101-18',
      applicationContext,
    });
    expect(result).to.deep.equal({ caseId: '123', status: 'new' });
  });

  it('should return null if no mapping records are returned from the query', async () => {
    client.query.resolves([]);
    const result = await getCaseByDocketNumber({
      pk: '123',
      sk: '123',
      docketNumber: '101-18',
      applicationContext,
    });
    expect(result).to.be.null;
  });
});
