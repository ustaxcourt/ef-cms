const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getCasesByUserId } = require('./getCasesByUserId');

describe('getCasesByUserId', () => {
  it('obtains all cases associated with the given user', async () => {
    const userId = 'user-id-123';

    await getCasesByUserId({
      applicationContext,
      userId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        should: [
          {
            term: {
              'privatePractitioners.L.M.userId.S': `${userId}`,
            },
          },
          {
            term: { 'irsPractitioners.L.M.userId.S': `${userId}` },
          },
          {
            term: { 'userId.S': `${userId}` },
          },
        ],
      },
    });
  });
});
