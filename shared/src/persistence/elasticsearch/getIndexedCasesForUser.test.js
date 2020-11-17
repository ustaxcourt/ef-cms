const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getIndexedCasesForUser } = require('./getIndexedCasesForUser');

describe('getIndexedCasesForUser', () => {
  beforeEach(() => {});

  it('should search for cases by the userId and statuses provided', async () => {
    const mockUserId = '123';

    await getIndexedCasesForUser({
      applicationContext,
      statuses: [
        CASE_STATUS_TYPES.new,
        CASE_STATUS_TYPES.jurisdictionRetained,
        CASE_STATUS_TYPES.calendared,
      ],
      userId: mockUserId,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toMatchObject([
      {
        match: {
          'pk.S': {
            operator: 'and',
            query: `user|${mockUserId}`,
          },
        },
      },
      {
        match: {
          'sk.S': 'case|',
        },
      },
      {
        match: {
          'gsi1pk.S': 'user-case|',
        },
      },
      {
        bool: {
          should: [
            {
              match: {
                'status.S': CASE_STATUS_TYPES.new,
              },
            },
            {
              match: {
                'status.S': CASE_STATUS_TYPES.jurisdictionRetained,
              },
            },
            {
              match: {
                'status.S': CASE_STATUS_TYPES.calendared,
              },
            },
          ],
        },
      },
    ]);
  });
});
