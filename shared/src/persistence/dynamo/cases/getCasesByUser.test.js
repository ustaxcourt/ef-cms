jest.mock('../../../../../shared/src/persistence/dynamodbClientService');
const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const { getCasesByUser } = require('./getCasesByUser');
const { User } = require('../../../business/entities/User');

let queryStub = jest.fn().mockReturnValue({
  promise: async () => ({
    Items: [],
  }),
});

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  getDocumentClient: () => ({
    query: queryStub,
  }),
  isAuthorizedForWorkItems: () => true,
};

const user = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

describe('getCasesByUser', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
    client.query = jest.fn().mockReturnValue([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
  });

  it('should return data as received from persistence', async () => {
    const result = await getCasesByUser({
      applicationContext,
      user,
    });
    expect(result).toEqual([
      {
        caseId: '123',
        docketRecord: [],
        documents: [],
        irsPractitioners: [],
        pk: 'case|123',
        privatePractitioners: [],
        sk: 'case|123',
        status: 'New',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.batchGet.mock.calls[0][0].keys).toEqual([
      { pk: 'case|123', sk: 'case|123' },
    ]);
  });
});
