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
        must: [
          { match: { 'pk.S': 'case|' } },
          { match: { 'sk.S': 'case|' } },
          {
            query_string: {
              fields: [
                'privatePractitioners.L.M.userId.S',
                'irsPractitioners.L.M.userId.S',
                'userId.S',
              ],
              query: `"${userId}"`,
            },
          },
        ],
      },
    });
  });
});
