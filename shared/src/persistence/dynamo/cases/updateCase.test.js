const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { updateCase } = require('./updateCase');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('updateCase', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
  });

  afterEach(() => {
    client.put.restore();
  });

  it('updates case with new version number', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        currentVersion: '10',
        docketNumber: '101-18',
        status: 'General',
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
