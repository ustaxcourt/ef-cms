const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getCasesByUser } = require('./getCasesByUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

let queryStub = jest.fn().mockReturnValue({
  promise: async () => ({
    Items: [],
  }),
});

applicationContext.filterCaseMetadata.mockImplementation(({ cases }) => cases);
applicationContext.getDocumentClient.mockReturnValue({
  query: queryStub,
});

const user = {
  role: ROLES.petitioner,
  userId: '522573b0-dc40-47f7-96fd-64758da315f5',
};

describe('getCasesByUser', () => {
  beforeEach(() => {
    client.query = jest
      .fn()
      .mockReturnValueOnce([
        {
          caseId: '123',
          pk: 'case|123',
          sk: 'case|123',
          status: 'New',
        },
      ])
      .mockReturnValueOnce([
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
        correspondence: [],
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

  it('should attempt to do a query using the found caseIds', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.query.mock.calls[1][0].ExpressionAttributeValues).toEqual({
      ':pk': 'case|123',
    });
  });
});
