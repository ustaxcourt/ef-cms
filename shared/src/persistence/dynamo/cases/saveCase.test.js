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

  it('should strip the pk and sk from the returned case', async () => {
    const result = await saveCase({
      applicationContext,
      caseToSave: {
        caseId: '123',
        status: 'New',
      },
    });
    expect(result).toEqual({ caseId: '123', status: 'New' });
  });

  it('should attempt to delete and put a new status mapping if the status changes', async () => {
    await saveCase({
      applicationContext,
      caseToSave: {
        caseId: '123',
        status: 'General Docket',
      },
    });
    expect(client.delete.getCall(0).args[0].key.pk).toEqual('New|case-status');
    expect(client.delete.getCall(0).args[0].key.sk).toEqual('123');
    expect(client.put.getCall(0).args[0].Item.pk).toEqual(
      'General|case-status',
    );
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('123');
  });

  it('creates a docket number mapping if this is the first time a case was created', async () => {
    client.get.resolves(null);
    await saveCase({
      applicationContext,
      caseToSave: {
        caseId: '123',
        docketNumber: '101-18',
        status: 'General Docket',
        userId: 'taxpayer',
      },
    });
    expect(client.put.getCall(0).args[0].Item.pk).toEqual('taxpayer|case');
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('123');
    expect(client.put.getCall(1).args[0].Item.pk).toEqual('101-18|case');
    expect(client.put.getCall(1).args[0].Item.sk).toEqual('123');
  });
});
