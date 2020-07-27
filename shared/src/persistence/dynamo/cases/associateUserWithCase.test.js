const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { associateUserWithCase } = require('./associateUserWithCase');

describe('associateUserWithCase', () => {
  const CASE_ID = 'de39ed01-c0a2-4722-a0fe-020ede8c4f05';

  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: `case|${CASE_ID}`,
              sk: `case|${CASE_ID}`,
            },
          ],
        }),
    });
  });

  it('should persist the mapping record to associate user with case', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      docketNumber: '123-20',
      userId: '123',
    });
    expect(result).toEqual({
      gsi1pk: `user-case|${CASE_ID}`,
      pk: 'user|123',
      sk: `case|${CASE_ID}`,
    });
  });
});
