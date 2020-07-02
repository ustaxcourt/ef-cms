const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { verifyPendingCaseForUser } = require('./verifyPendingCaseForUser');

const userId = '123';
const caseId = 'abc';

describe('verifyPendingCaseForUser', () => {
  it('should return true if mapping record for user to case exists', async () => {
    client.query = jest.fn().mockReturnValue([
      {
        pk: 'user|123',
        sk: 'pending-case|098',
      },
    ]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(true);
  });
  it('should return false if mapping record for user to case does not exist', async () => {
    client.query = jest.fn().mockReturnValue([]);
    const result = await verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
    expect(result).toEqual(false);
  });
});
