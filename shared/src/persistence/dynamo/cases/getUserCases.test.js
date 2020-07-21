const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCases } = require('./getUserCases');
const { ROLES } = require('../../../business/entities/EntityConstants');

let queryStub = jest.fn().mockReturnValue({
  promise: async () => ({
    Items: [],
  }),
});

applicationContext.getDocumentClient.mockReturnValue({
  query: queryStub,
});

const user = {
  role: ROLES.petitioner,
  userId: '522573b0-dc40-47f7-96fd-64758da315f5',
};

describe('getUserCases', () => {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValueOnce([
      {
        caseId: '123',
        leadCaseId: '321',
        pk: 'user|123',
        sk: 'case|123',
        status: 'New',
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
        caseId: '123',
        leadCaseId: '321',
        status: 'New',
      },
    ]);
  });
});
