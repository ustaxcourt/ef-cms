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
  isAuthorizedForWorkItems: () => true,
};

describe('saveCase', () => {
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

  it('should strip the pk and sk from the returned case', async () => {
    const result = await saveCase({
      caseToSave: {
        caseId: '123',
        status: 'new',
      },
      applicationContext,
    });
    expect(result).to.deep.equal({ caseId: '123', status: 'new' });
  });

  it('should attempt to delete and put a new status mapping if the status changes', async () => {
    await saveCase({
      caseToSave: {
        caseId: '123',
        status: 'general',
      },
      applicationContext,
    });
    expect(client.delete.getCall(0).args[0].key.pk).to.equal('new|case-status');
    expect(client.delete.getCall(0).args[0].key.sk).to.equal('123');
    expect(client.put.getCall(0).args[0].Item.pk).to.equal(
      'general|case-status',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
  });
});
