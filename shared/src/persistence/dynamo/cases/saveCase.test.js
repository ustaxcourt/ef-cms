const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { saveCase } = require('./saveCase');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('saveCase', () => {
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

  it('should strip the pk and sk from the returned case', async () => {
    const result = await saveCase({
      caseToSave: {
        caseId: '123',
        status: 'New',
      },
      applicationContext,
    });
    expect(result).to.deep.equal({ caseId: '123', status: 'New' });
  });

  it('should attempt to delete and put a new status mapping if the status changes', async () => {
    await saveCase({
      caseToSave: {
        caseId: '123',
        status: 'General',
      },
      applicationContext,
    });
    expect(client.delete.getCall(0).args[0].key.pk).to.equal('New|case-status');
    expect(client.delete.getCall(0).args[0].key.sk).to.equal('123');
    expect(client.put.getCall(0).args[0].Item.pk).to.equal(
      'General|case-status',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
  });

  it('creates a docket number mapping if this is the first time a case was created', async () => {
    client.get.resolves(null);
    await saveCase({
      caseToSave: {
        caseId: '123',
        userId: 'taxpayer',
        status: 'General',
        docketNumber: '101-18',
      },
      applicationContext,
    });
    expect(client.put.getCall(0).args[0].Item.pk).to.equal('taxpayer|case');
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
    expect(client.put.getCall(1).args[0].Item.pk).to.equal('101-18|case');
    expect(client.put.getCall(1).args[0].Item.sk).to.equal('123');
  });
});
