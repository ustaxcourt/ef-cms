const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getConsolidatedCasesByUser } = require('./getConsolidatedCasesByUser');
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
  userId: '321',
};

describe('getConsolidatedCasesByUser', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      pk: '321|consolidated-case',
      sk: '321|consolidated-case',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      caseId: '123',
      pk: '321|consolidated-case',
      sk: '321|consolidated-case',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      caseId: '123',
      pk: '321|consolidated-case',
      sk: '321|consolidated-case',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        pk: '321|consolidated-case',
        sk: '321|consolidated-case',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: '321|consolidated-case',
        sk: '321|consolidated-case',
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
    const result = await getConsolidatedCasesByUser({
      applicationContext,
      user,
    });
    expect(result).toEqual([{ caseId: '123', status: 'New' }]);
  });
});
