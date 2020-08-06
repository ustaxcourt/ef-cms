const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { getUserCases } = require('./getUserCases');

describe('getUserCases', () => {
  const user = {
    role: ROLES.petitioner,
    userId: '522573b0-dc40-47f7-96fd-64758da315f5',
  };

  let queryStub = jest.fn().mockReturnValue({
    promise: async () => ({
      Items: [],
    }),
  });

  applicationContext.getDocumentClient.mockReturnValue({
    query: queryStub,
  });

  beforeEach(() => {
    client.query = jest.fn().mockReturnValueOnce([
      {
        docketNumber: '123-20',
        leadDocketNumber: '321-20',
        pk: 'user|123',
        sk: 'case|123',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('should return data with stripped internal keys from persistence', async () => {
    const result = await getUserCases({
      applicationContext,
      user,
    });

    expect(result).toEqual([
      {
        docketNumber: '123-20',
        leadDocketNumber: '321-20',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });
});
