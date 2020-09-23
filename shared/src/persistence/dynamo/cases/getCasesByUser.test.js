const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { getCasesByUser } = require('./getCasesByUser');

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
          docketNumber: '123-20',
          pk: 'case|123-20',
          sk: 'case|123-20',
          status: CASE_STATUS_TYPES.new,
        },
      ])
      .mockReturnValueOnce([
        {
          docketNumber: '123-20',
          pk: 'case|123-20',
          sk: 'case|123-20',
          status: CASE_STATUS_TYPES.new,
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
        archivedCorrespondences: [],
        archivedDocuments: [],
        correspondence: [],
        docketEntries: [],
        docketNumber: '123-20',
        irsPractitioners: [],
        pk: 'case|123-20',
        privatePractitioners: [],
        sk: 'case|123-20',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('should attempt to do a query using the found docketNumbers', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.query.mock.calls[1][0].ExpressionAttributeValues).toEqual({
      ':pk': 'case|123-20',
    });
  });
});
