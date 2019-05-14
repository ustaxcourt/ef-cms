const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { updateCase } = require('./updateCase');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('updateCase', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
    sinon.stub(client, 'get').resolves({
      docketNumberSuffix: null,
      status: 'General Docket',
    });
    sinon.stub(client, 'query').resolves([]);
  });

  afterEach(() => {
    client.put.restore();
    client.get.restore();
    client.query.restore();
  });

  it('updates case with new version number', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        currentVersion: '10',
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: 'General Docket',
        userId: 'taxpayer',
      },
    });
    expect(client.put.getCall(0).args[0].Item).toMatchObject({
      pk: '123',
      sk: '0',
    });
    expect(client.put.getCall(1).args[0].Item).toMatchObject({
      pk: '123',
      sk: '11',
    });
  });
});
