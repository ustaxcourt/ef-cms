const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCasesByUser } = require('./getCasesByUser');
const { User } = require('../../../business/entities/User');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

const user = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

describe('getCasesByUser', () => {
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
    const result = await getCasesByUser({
      applicationContext,
      user,
    });
    expect(result).toEqual([{ caseId: '123', status: 'New' }]);
  });
  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.batchGet.getCall(0).args[0].keys).toEqual([
      { pk: '123', sk: '123' },
    ]);
  });
});
