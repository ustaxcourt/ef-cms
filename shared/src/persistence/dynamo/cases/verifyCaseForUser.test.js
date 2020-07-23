const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { verifyCaseForUser } = require('./verifyCaseForUser');

const userId = '123';
const docketNumber = '123-20';

describe('verifyCaseForUser', () => {
  it('should return true if mapping record for user to case exists', async () => {
    client.query = jest.fn().mockReturnValue([
      {
        pk: 'user|123',
        sk: 'case|098',
      },
    ]);
    const result = await verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(true);
  });
  it('should return false if mapping record for user to case does not exist', async () => {
    client.query = jest.fn().mockReturnValue([]);
    const result = await verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId,
    });
    expect(result).toEqual(false);
  });
});
