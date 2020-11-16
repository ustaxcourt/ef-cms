const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getCasesByUserId } = require('./getCasesByUserId');

describe('getCasesByUserId', () => {
  it('obtains all open cases and closed cases (within the last six [6] months) associated with the given user', async () => {
    const userId = 'user-id-123';

    await getCasesByUserId({
      applicationContext,
      userId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        minimum_should_match: 1,
        should: [
          {
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
                { match: { 'status.S': CASE_STATUS_TYPES.closed } },
                {
                  range: {
                    'closedDate.S': {
                      format: 'strict_date_time',
                      gte: expect.anything(),
                    },
                  },
                },
              ],
            },
          },
          {
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
              must_not: {
                match: { 'status.S': CASE_STATUS_TYPES.closed },
              },
            },
          },
        ],
      },
    });
  });
});
