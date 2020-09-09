const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getDocketNumbersByUser } = require('./getDocketNumbersByUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('getDocketNumbersByUser', () => {
  const user = {
    role: ROLES.petitioner,
    userId: '522573b0-dc40-47f7-96fd-64758da315f5',
  };

  beforeEach(() => {
    client.query = jest.fn().mockReturnValueOnce([
      {
        pk: 'user|455de2eb-77b2-4815-aa2b-99475b2f68bb',
        sk: 'case|123-20',
      },
      {
        pk: 'user|455de2eb-77b2-4815-aa2b-99475b2f68bb',
        sk: 'case|124-20',
      },
    ]);
  });

  it('should return docket numbers from persistence', async () => {
    const result = await getDocketNumbersByUser({
      applicationContext,
      user,
    });

    expect(result).toEqual(['123-20', '124-20']);
  });
});
