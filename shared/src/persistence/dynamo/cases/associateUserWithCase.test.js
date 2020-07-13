const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { associateUserWithCase } = require('./associateUserWithCase');

describe('associateUserWithCase', () => {
  it('should persist the mapping record to associate user with case', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      caseId: '234',
      userId: '123',
    });
    expect(result).toEqual({
      gsi1pk: 'user-case|234',
      pk: 'user|123',
      sk: 'case|234',
    });
  });
});
