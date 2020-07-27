const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  associateUserWithCasePending,
} = require('./associateUserWithCasePending');

describe('associateUserWithCasePending', () => {
  const CASE_ID = '798ae491-64a1-4b01-9868-c3228ce3a1a0';

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

  it('should create mapping request that creates pending association request', async () => {
    const result = await associateUserWithCasePending({
      applicationContext,
      docketNumber: '123-20',
      userId: '123',
    });
    expect(result).toEqual({
      pk: 'user|123',
      sk: `pending-case|${CASE_ID}`,
    });
  });
});
