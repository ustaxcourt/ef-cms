const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  associateUserWithCasePending,
} = require('./associateUserWithCasePending');

describe('associateUserWithCasePending', () => {
  it('should create mapping request that creates pending association request', async () => {
    const result = await associateUserWithCasePending({
      applicationContext,
      caseId: '123',
      userId: '123',
    });
    expect(result).toEqual({
      pk: 'user|123',
      sk: 'pending-case|123',
    });
  });
});
